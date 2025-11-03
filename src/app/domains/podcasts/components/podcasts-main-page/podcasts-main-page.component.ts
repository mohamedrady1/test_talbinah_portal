import {
  FavouritePodcastListHeaderConfig,
  getFavoritePodcastsError,
  getPodcastsInCategoryError,
  getRandomPodcastsError,
  getRecommendedPodcastsError,
  MainHeaderConfig,
  MostListenedHeaderConfig,
  NoFavoritePodcasts,
  NoPodcastsInCategory,
  NoRandomPodcasts,
  NoRecommendedPodcasts,
  RecommendedPodcastListHeaderConfig,
  PodcastSegmentOptions,
} from '../../configs';
import {
  EmptyStateCardComponent,
  ErrorStateCardComponent,
  IHeaderConfig,
  LocalizationService,
  ModalService,
  PageLayoutHeaderComponent,
  PaginationConfig,
  MoodModalIntegrationService,
  StorageKeys,
  CompeleteDataAndRegisterNowComponent,
  SegmentControlComponent,
} from '../../../../shared';
import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
  HostListener,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import {
  AutoExactHeightDirective,
  Logger,
  MetadataService,
  StorageService,
} from '../../../../common';
import { AllFavouritePodcastsComponent } from '../all-favourite-podcasts';
import { PodcastSkeletonComponent } from '../podcast-skeleton';
import {
  PodcastsMainPageFacade,
  ToggleFavoritePodcastFacade,
} from '../../services';
import { MainPageRoutesEnum } from '../../../main-page';
import { PodcastCardComponent } from '../podcast-card';
import { TranslateModule } from '@ngx-translate/core';
import { SiteHeaderComponent } from '../../../header';
import { CardHeaderComponent } from '../card-header';
import { PodcastRoutesEnum, PodcastsRouteData } from '../../constants';
import { PodcastItemType } from '../../enums';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RoleGuardService, UserContextService } from '../../../authentication';

@Component({
  selector: 'app-podcasts-main-page',
  standalone: true,
  imports: [
    TranslateModule,

    PageLayoutHeaderComponent,
    PodcastSkeletonComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    PodcastCardComponent,
    CardHeaderComponent,
    SiteHeaderComponent,

    AutoExactHeightDirective,
    CompeleteDataAndRegisterNowComponent,
    SegmentControlComponent,
  ],
  templateUrl: './podcasts-main-page.component.html',
  styleUrls: ['./podcasts-main-page.component.scss'],
})
export class PodcastsMainPageComponent {
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  protected readonly facade = inject(PodcastsMainPageFacade);
  private readonly toggleFavoriteFacade = inject(ToggleFavoritePodcastFacade);
  private readonly platformId = inject(PLATFORM_ID);

  protected allPodcastsLoaded = signal(false);
  protected favoritePodcastsLoaded = signal(false);
  protected randomPodcastsLoaded = signal(false);
  protected recommendedPodcastsLoaded = signal(false);
  protected podcastCategoriesLoaded = signal(false);

  // Mobile segment control
  protected selectedSegmentId = signal<string>('recommended');
  protected readonly segmentOptions = PodcastSegmentOptions;

  // Computed properties for showing sections
  protected readonly showRecommended = computed(() => this.selectedSegmentId() === 'recommended');
  protected readonly showExplore = computed(() => this.selectedSegmentId() === 'explore');
  protected readonly showFavourite = computed(() => this.selectedSegmentId() === 'favourite');

  protected readonly PodcastItemTypes = PodcastItemType;
  protected readonly noRecommendedPodcasts = NoRecommendedPodcasts;
  protected readonly noPodcastsInCategory = NoPodcastsInCategory;
  protected readonly noRandomPodcasts = NoRandomPodcasts;
  protected readonly noFavoritePodcasts = NoFavoritePodcasts;

  protected readonly recommendedPodcastsError = getRecommendedPodcastsError(
    () => this.facade.fetchRecommendedPodcasts()
  );
  protected readonly podcastsInCategoryError = getPodcastsInCategoryError(() =>
    this.facade.fetchAllPodcasts()
  );
  protected readonly randomPodcastsError = getRandomPodcastsError(() =>
    this.facade.fetchRandomPodcasts()
  );
  protected readonly favoritePodcastsError = getFavoritePodcastsError(() =>
    this.facade.fetchFavouritePodcasts()
  );

  // Responsive items per page based on screen size
  private readonly screenWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  protected readonly recommendedItemsPerPage = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 4;
  });

  protected readonly exploreItemsPerPage = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 4;
  });

  protected readonly selectionsItemsPerPage = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 4;
  });

  // Responsive skeleton counts
  protected readonly recommendedSkeletonCount = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 2; // desktop (keeping original count)
  });

  protected readonly exploreSkeletonCount = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 4; // desktop (keeping original count)
  });

  protected readonly selectionsSkeletonCount = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 4; // desktop (keeping original count)
  });

  // Responsive favorites display limit
  protected readonly favoritesDisplayLimit = computed(() => {
    const width = this.screenWidth();
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    return 4; // desktop (keeping original limit)
  });

  private readonly currentRecommendedPage = signal(1);
  private readonly currentExplorePage = signal(1);
  private readonly currentSelectionsPage = signal(1);
  private readonly hasFetchedExploreInitial = signal(false);

  // Smart state management to prevent duplicate requests while allowing fresh data on logout/login
  private readonly _hasFetchedAllPodcastsOnce = signal<boolean>(false);
  private readonly _hasFetchedFavouritePodcastsOnce = signal<boolean>(false);
  private readonly _hasFetchedRecommendedPodcastsOnce = signal<boolean>(false);
  private readonly _hasFetchedCategoriesOnce = signal<boolean>(false);
  private readonly _lastLoginToken = signal<string | null>(null);

  protected isFullscreen = false;
  readonly currentAllPodcastsPage = signal(1);
  readonly totalPagesAllPodcasts = signal(1);

  readonly paginationConfig = signal<PaginationConfig>({
    currentPage: this.currentAllPodcastsPage(),
    totalPages: this.totalPagesAllPodcasts(),
    onPageChange: this.handleAllPodcastsPageChange.bind(this),
  });

  isPrevRecommendedDisabled = computed(
    () => this.currentRecommendedPage() <= 1
  );
  isNextRecommendedDisabled = computed(
    () =>
      this.currentRecommendedPage() >=
      Math.ceil(
        this.facade.totalRecommendedItems() / this.recommendedItemsPerPage()
      )
  );
  isPrevExploreDisabled = computed(() => this.currentExplorePage() <= 1);
  isNextExploreDisabled = computed(
    () =>
      this.currentExplorePage() >=
      Math.ceil(this.facade.totalItems() / this.exploreItemsPerPage())
  );

  selectedExploreCategoryTab = signal('all');

  protected readonly explorePodcastListHeaderConfig = computed(() => {
    const categoryTabItems = this.facade.podcastCategories();
    const allTab = {
      id: 0,
      name: 'all',
      color: '#000000',
      image: 'https://talbinahtest.s3.eu-central-1.amazonaws.com/podcast-categories-images/nUq3DKDekYKIBR1g9NqFcVzSnthxfvpeW6Iryn3B.png',
      created_at: '2024-07-30T15:49:47.000000Z',
      updated_at: '2024-07-30T15:49:47.000000Z'
    };

    const tabs = categoryTabItems.length > 0 ? [allTab, ...categoryTabItems] : [allTab];

    // Ensure default = "All"
    const selected = this.selectedExploreCategoryTab() || 'all';

    return {
      title: 'podcast_card_explore_title',
      // title: 'explore_podcasts',
      isButtonsVisible: Math.ceil(this.facade.totalItems() / this.exploreItemsPerPage()) > 1,
      isAllButtonVisible: false,
      isTabsEnabled: true,
      tabs,
      selectedTab: selected
    };
  });

  @ViewChild('card') cardRef!: ElementRef;

  protected readonly headerConfig: IHeaderConfig = MainHeaderConfig;
  protected readonly mostListenedHeaderConfig = MostListenedHeaderConfig;

  protected readonly recommendedPodcastListListHeaderConfig = computed(() => ({
    ...RecommendedPodcastListHeaderConfig,
    isButtonsVisible:
      Math.ceil(
        this.facade.totalRecommendedItems() / this.recommendedItemsPerPage()
      ) > 1,
  }));

  protected readonly favouritePodcastListHeaderConfig = computed(() => ({
    ...FavouritePodcastListHeaderConfig,
    isAllButtonVisible:
      this.facade.totalFavoriteItems() > this.favoritesDisplayLimit(),
  }));

  protected readonly selectionsPodcastListHeaderConfig = computed(() => ({
    title: 'podcast_selections',
    isButtonsVisible:
      Math.ceil(
        this.facade.totalRandomItems() / this.selectionsItemsPerPage()
      ) > 1,
    isAllButtonVisible: false,
    isTabsEnabled: false,
    tabs: [],
    selectedTab: '',
  }));
  protected isBrowser: boolean;

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    const newToken = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    const oldToken = this._lastLoginToken();

    this.token.set(newToken);

    // Check if login state has changed (login/logout)
    if (newToken !== oldToken) {
      Logger.debug('PodcastsMainPageComponent: Login state changed, resetting fetch flags');
      this._resetFetchFlags();
      this._lastLoginToken.set(newToken);
    }
  }

  /** Reset fetch flags when login state changes */
  private _resetFetchFlags(): void {
    Logger.debug('PodcastsMainPageComponent: Resetting fetch flags for fresh data');
    this._hasFetchedAllPodcastsOnce.set(false);
    this._hasFetchedFavouritePodcastsOnce.set(false);
    this._hasFetchedRecommendedPodcastsOnce.set(false);
    this._hasFetchedCategoriesOnce.set(false);
  }

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setSeoMeta();

    // Keep favorite facade sync
    if (this.isBrowser) {
      this.toggleFavoriteFacade.setResponsivePaginationCallback(() => ({
        recommendedPage: this.currentRecommendedPage(),
        recommendedItemsPerPage: this.recommendedItemsPerPage(),
        explorePage: this.currentExplorePage(),
        exploreItemsPerPage: this.exploreItemsPerPage(),
        selectionsPage: this.currentSelectionsPage(),
        selectionsItemsPerPage: this.selectionsItemsPerPage(),
      }));
    }
    if (this.isBrowser) {
      // 👇 Ensure initial tab = "All" once categories load, and fetch explore ONLY once here
      effect(() => {
        const categories = this.facade.podcastCategories();
        if (Array.isArray(categories) && categories.length > 0 && this.selectedExploreCategoryTab() === 'all' && !this.hasFetchedExploreInitial()) {
          // set params
          this.facade.updateCategoryFilter(null);
          this.currentExplorePage.set(1);
          // single fetch
          // this.facade.fetchAllPodcastsWithPagination(this.currentExplorePage(), this.exploreItemsPerPage());
          this.hasFetchedExploreInitial.set(true);
        }
      });

      // Track when requests complete successfully
      effect(() => {
        const isLoading = this.facade.isLoadingAllPodcasts();
        const hasData = this.facade.allPodcastsResponse() !== null;
        if (!isLoading && hasData) {
          this.allPodcastsLoaded.set(true);
        }
      });

      effect(() => {
        const isLoading = this.facade.isLoadingFavouritePodcasts();
        const hasData = this.facade.favouritePodcastsResponse() !== null;
        if (!isLoading && hasData) {
          this.favoritePodcastsLoaded.set(true);
        }
      });

      effect(() => {
        const isLoading = this.facade.isLoadingRecommendedPodcasts();
        const hasData = this.facade.recommendedPodcastsResponse() !== null;
        if (!isLoading && hasData) {
          this.recommendedPodcastsLoaded.set(true);
        }
      });

      effect(() => {
        const isLoading = this.facade.isLoadingRandomPodcasts();
        const hasData = this.facade.randomPodcastsResponse() !== null;
        if (!isLoading && hasData) {
          this.randomPodcastsLoaded.set(true);
        }
      });

      effect(() => {
        const isLoading = this.facade.isLoadingPodcastCategories();
        const hasData = this.facade.podcastCategories() !== null;
        if (!isLoading && hasData) {
          this.podcastCategoriesLoaded.set(true);
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      const newWidth = event.target.innerWidth;
      const oldWidth = this.screenWidth();
      this.screenWidth.set(newWidth);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      Logger.debug('PodcastsMainPageComponent: Initializing component');
      this.refreshLoginStatus();
      Logger.debug('PodcastsMainPageComponent: After refreshLoginStatus - isLoggedIn:', this.isLoggedIn(), 'token:', this.token());
      this._loadInitialData();
      this.setUpFetchDataAfterLogin();
    }
  }

  /** Load initial data based on login status */
  private _loadInitialData(): void {
    Logger.debug('PodcastsMainPageComponent: Loading initial data');

    // Always fetch data that doesn't require login
    if (!this._hasFetchedAllPodcastsOnce()) {
      this.facade.fetchAllPodcasts();
      this._hasFetchedAllPodcastsOnce.set(true);
    }

    if (!this._hasFetchedCategoriesOnce()) {
      this.facade.fetchPodcastCategories();
      this._hasFetchedCategoriesOnce.set(true);
    }

    if (!this._hasFetchedRecommendedPodcastsOnce()) {
      this.facade.fetchRecommendedPodcasts(
        this.currentRecommendedPage(),
        this.recommendedItemsPerPage()
      );
      this._hasFetchedRecommendedPodcastsOnce.set(true);
    }

    // Always try to fetch favorite podcasts if user is logged in
    const currentToken = this._StorageService.getItem<string>(StorageKeys.TOKEN);
    Logger.debug('PodcastsMainPageComponent: Checking favourite podcasts - currentToken:', !!currentToken, 'isLoggedIn:', this.isLoggedIn(), 'hasFetchedOnce:', this._hasFetchedFavouritePodcastsOnce());

    if (currentToken && !this._hasFetchedFavouritePodcastsOnce()) {
      Logger.debug('PodcastsMainPageComponent: Fetching favourite podcasts in initial load');
      this.facade.fetchFavouritePodcasts();
      this._hasFetchedFavouritePodcastsOnce.set(true);
    } else if (!currentToken) {
      Logger.debug('PodcastsMainPageComponent: No token found, resetting favourite podcasts');
      this.facade.resetFavouritePodcasts();
    } else {
      Logger.debug('PodcastsMainPageComponent: Skipping favourite podcasts fetch - already fetched');
    }
  }

  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('PodcastsMainPageComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + PodcastRoutesEnum.PODCASTSMAINPAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          this._loadDataAfterLoginChange();
        }
      });
  }

  /** Load data after login state changes, preventing duplicates */
  private _loadDataAfterLoginChange(): void {
    Logger.debug('PodcastsMainPageComponent: Loading data after login change');

    // Only fetch data that hasn't been fetched yet or when login state changes
    if (!this._hasFetchedAllPodcastsOnce()) {
      this.facade.fetchAllPodcasts();
      this._hasFetchedAllPodcastsOnce.set(true);
    }

    if (!this._hasFetchedCategoriesOnce()) {
      this.facade.fetchPodcastCategories();
      this._hasFetchedCategoriesOnce.set(true);
    }

    if (!this._hasFetchedRecommendedPodcastsOnce()) {
      this.facade.fetchRecommendedPodcasts(
        this.currentRecommendedPage(),
        this.recommendedItemsPerPage()
      );
      this._hasFetchedRecommendedPodcastsOnce.set(true);
    }

    // Handle favorite podcasts based on login status
    if (this.isLoggedIn()) {
      // Always fetch favourite podcasts when user is logged in (fresh data needed)
      Logger.debug('PodcastsMainPageComponent: Fetching favourite podcasts after login change');
      this.facade.fetchFavouritePodcasts();
      this._hasFetchedFavouritePodcastsOnce.set(true);
    } else {
      // Reset favorite podcasts when logged out
      this.facade.resetFavouritePodcasts();
      this._hasFetchedFavouritePodcastsOnce.set(false); // Allow fetching again when logged back in
    }
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();
  }

  private handleAllPodcastsPageChange(page: number): void {
    this.currentAllPodcastsPage.set(page);
    // this.facade.fetchAllPodcasts();
  }

  protected onNextRecommended(): void {
    if (this.currentRecommendedPage() < Math.ceil(this.facade.totalRecommendedItems() / this.recommendedItemsPerPage())) {
      this.currentRecommendedPage.update(p => p + 1);
      this.facade.fetchRecommendedPodcasts(this.currentRecommendedPage(), this.recommendedItemsPerPage());
    }
  }

  protected onPrevRecommended(): void {
    if (this.currentRecommendedPage() > 1) {
      this.currentRecommendedPage.update(p => p - 1);
      this.facade.fetchRecommendedPodcasts(this.currentRecommendedPage(), this.recommendedItemsPerPage());
    }
  }

  protected onNextExplore(): void {
    if (this.currentExplorePage() < Math.ceil(this.facade.totalItems() / this.exploreItemsPerPage())) {
      this.currentExplorePage.update(p => p + 1);
      this.facade.fetchAllPodcastsWithPagination(this.currentExplorePage(), this.exploreItemsPerPage());
    }
  }

  protected onPrevExplore(): void {
    if (this.currentExplorePage() > 1) {
      this.currentExplorePage.update(p => p - 1);
      this.facade.fetchAllPodcastsWithPagination(this.currentExplorePage(), this.exploreItemsPerPage());
    }
  }

  private setSeoMeta(): void {
    const { title, meta } = PodcastsRouteData.PodcastsMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'podcast, home, talbinah',
      image: 'https://portal.dev.talbinah.net/images/home/icons/microphone.png',
      url: 'https://talbinah.com/podcast',
      robots: 'index, follow',
      locale: 'en_US',
      canonical: 'https://talbinah.com/podcast',
    });
  }

  protected goHome(): void {
    if (this.isBrowser) this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardEl = this.cardRef?.nativeElement;
      if (!cardEl) return;
      if (!document.fullscreenElement) {
        cardEl
          .requestFullscreen()
          .then(() => (this.isFullscreen = true))
          .catch(() => (this.isFullscreen = false));
      } else {
        document.exitFullscreen().then(() => (this.isFullscreen = false));
      }
    }
  }

  protected onTabCategorySelected(selectedTab: any): void {
    if (this.isBrowser) {
      Logger.debug('Tab category selected:', selectedTab);
      this.selectedExploreCategoryTab.set(selectedTab.name);
      this.facade.updateCategoryFilter(
        selectedTab.id === 0 ? null : selectedTab.id
      );
      this.currentExplorePage.set(1);
      // Prevent the initial effect from firing a second fetch when "All" is selected
      if (selectedTab.name === 'all' && !this.hasFetchedExploreInitial()) {
        this.hasFetchedExploreInitial.set(true);
      }
      this.facade.fetchAllPodcastsWithPagination(this.currentExplorePage(), this.exploreItemsPerPage());
    }
  }

  protected openAllFavouritePopup(): void {
    if (this.isBrowser) {
      this.modalService.open(AllFavouritePodcastsComponent, {
        showMobileHeader: true,
        inputs: {
          image: 'images/podcast/icons/mic.png',
          title: 'favorite_podcasts',
          subtitle: 'podcast_page_header_description',
        },
        width: '50%',
        outputs: { closed: () => console.log('The model is closed') },
      });
    }
  }

  protected onSegmentChanged(option: typeof PodcastSegmentOptions[number]): void {
    this.selectedSegmentId.set(option.id as string);
  }
}
