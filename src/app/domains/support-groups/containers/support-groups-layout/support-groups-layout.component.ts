import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, PLATFORM_ID, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { CompeleteDataAndRegisterNowComponent, EmptyStateCardComponent, ErrorStateCardComponent, ICardHeaderConfig, IHeaderConfig, LocalizationService, ModalService, MoodModalIntegrationService, PageLayoutHeaderComponent, PaginationConfig, PaginationListingComponent, StorageKeys, SegmentControlComponent, SegmentOption } from '../../../../shared';
import { AllSupportGroupsComponent, GroupCardComponent, GroupCardShimmerComponent, SupportGroupsTabsComponent, SupportGroupSubscriptionComponent } from '../../components';
import { AutoExactHeightDirective, CardType, Logger, MetadataService, StorageService } from '../../../../common';
import { DetailsHeaderConfig, exploreTherapyProgramsHeader } from '../../../therapeutic-programs';
import { SeminarItemFacade, SeminarsFacade } from '../../services';
import { MyGroupsHeader, SupportGroups } from '../../configs';
import { ISeminarItemDto } from '../../dtos';
import { SupportGroupsRouteData, SupportGroupsRoutesEnum } from '../../constants';
import { EmptyState } from '../../configs/empty-state.config';
import { getErrorSupportGroups } from '../../configs/error-state.config';
import { CardHeaderComponent } from '../../components/card-header';
import { SiteHeaderComponent } from '../../../header';
import { PaymentPageTypeEnum, PaymentStateService, RoutePaymentInfo } from '../../../payments';
import { MainPageRoutesEnum } from '../../../main-page';
import { RoleGuardService, UserContextService } from '../../../authentication';

@Component({
  selector: 'app-support-groups-layout',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
    GroupCardComponent,
    SupportGroupsTabsComponent,
    AutoExactHeightDirective,
    GroupCardShimmerComponent,
    ErrorStateCardComponent,
    CardHeaderComponent,
    EmptyStateCardComponent,
    PaginationListingComponent,
    CompeleteDataAndRegisterNowComponent,
    SegmentControlComponent
  ],
  templateUrl: './support-groups-layout.component.html',
  styleUrls: ['./support-groups-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportGroupsLayoutComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  protected readonly _SeminarsFacade = inject(SeminarsFacade);
  private readonly _seo = inject(MetadataService);
  private readonly _localizationService = inject(LocalizationService);
  protected readonly _seminarItemFacade = inject(SeminarItemFacade);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _paymentStateService = inject(PaymentStateService);
  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly _destroy$ = new Subject<void>();

  exploreSeminarsHeader: ICardHeaderConfig = exploreTherapyProgramsHeader;
  mySeminarsHeader: ICardHeaderConfig = MyGroupsHeader;
  protected cardTypes = CardType;
  protected readonly emptyState = EmptyState;
  protected readonly myProgramsErrorState = computed(() =>
    getErrorSupportGroups(() => this._SeminarsFacade.fetchMySeminars(), this._SeminarsFacade.mySeminarsErrorMessage() || undefined)
  );
  protected readonly allProgramsErrorState = computed(() =>
    getErrorSupportGroups(() => this._SeminarsFacade.fetchAllSeminars(), this._SeminarsFacade.allSeminarsErrorMessage() || undefined)
  );

  public readonly queryItemId = signal<number | string | null>(null);
  public readonly queryStatus = signal<boolean | null>(null);

  // --- Local Pagination State ---
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(6); // 6 items per page

  readonly allSeminarsPaginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this._SeminarsFacade.currentAllSeminarsPage(),
    totalPages: this._SeminarsFacade.totalAllSeminarsItems(),
    onPageChange: (page: number) => this.handleAllSeminarsPageChange(page)
  }));

  readonly mySeminarsPaginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this._SeminarsFacade.currentMySeminarsPage(),
    totalPages: this._SeminarsFacade.totalMySeminarsItems(),
    onPageChange: (page: number) => this.handleMySeminarsPageChange(page)
  }));

  // Local pagination configuration for displayed items
  readonly localPaginationConfig = computed<PaginationConfig>(() => {
    const allData = this._SeminarsFacade.allSeminars()?.data || [];
    const totalItems = allData.length;
    const totalPages = Math.ceil(totalItems / this._itemsPerPage());

    return {
      currentPage: this._currentPage(),
      totalPages: totalPages,
      onPageChange: (page: number) => this.handleLocalPageChange(page)
    };
  });

  // Get paginated data for current page
  readonly paginatedSeminars = computed(() => {
    const allData = this._SeminarsFacade.allSeminars()?.data || [];
    const currentPage = this._currentPage();
    const itemsPerPage = this._itemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allData.slice(startIndex, endIndex);
  });

  // Computed signals for total items
  protected readonly totalMySeminarsItems = computed(() => this._SeminarsFacade.totalMySeminarsItems());
  protected readonly totalAllSeminarsItems = computed(() => this._SeminarsFacade.allSeminars()?.data?.length ?? 0);

  supportGroupsCardsHeader: ICardHeaderConfig = SupportGroups;
  groupCardsHeader: ICardHeaderConfig = MyGroupsHeader;

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  protected readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  // Segment control for mobile view
  protected readonly selectedSegmentId = signal<string>('allGroups');
  protected readonly isMobileView = signal<boolean>(false);

  protected readonly segmentOptions: SegmentOption[] = [
    { id: 'allGroups', title: 'support_sessions' },
    { id: 'myGroups', title: 'my_support_sessions' }
  ];

  // Show/hide logic for sections
  protected readonly showAllGroups = computed(() =>
    !this.isMobileView() || this.selectedSegmentId() === 'allGroups'
  );
  protected readonly showMyGroups = computed(() =>
    !this.isMobileView() || this.selectedSegmentId() === 'myGroups'
  );

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  protected onSegmentChanged(option: SegmentOption): void {
    this.selectedSegmentId.set(option.id as string);
  }

  constructor() {
    this.setSeoMeta();

    effect(() => {
      const allSeminarsDataLength = this._SeminarsFacade.allSeminars()?.data?.length ?? 0;
      const mySeminarsDataLength = this._SeminarsFacade.mySeminars()?.data?.length ?? 0;
      Logger.debug('Effect: allSeminarsDataLength changed to:', allSeminarsDataLength);
      this.supportGroupsCardsHeader.isAllButtonVisible = allSeminarsDataLength > 6;
      this.mySeminarsHeader.isAllButtonVisible = mySeminarsDataLength > 6;
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Check if mobile view
    this.isMobileView.set(window.innerWidth < 768);
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isMobileView.set(window.innerWidth < 768);
    });

    this._paymentStateService.routePaymentInfo$
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: RoutePaymentInfo | null) => {
        Logger.debug('TherapeuticProgramsListingComponent: RoutePaymentInfo received:', data);

        if (data && (data.itemId != null || data.status === false)) {
          Logger.debug(
            'TherapeuticProgramsListingComponent: handling payment result',
            data
          );

          // ✅ 1. Open Status Info popup automatically
          this._paymentStateService.openPaymentStatusInfo(
            { ...data },
            PaymentPageTypeEnum.SEMINAR
          );

          // ✅ 2. Clear query params from URL (SSR-safe)
          this.router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {},
            replaceUrl: true,
          });

          // ✅ 3. Clear in-memory payment state so it doesn't reopen
          this._paymentStateService.clearRoutePaymentInfo();
        }

      });

    this._seminarItemFacade.openSeminarDetails
      .pipe(
        takeUntil(this._destroy$),
        filter((details: { id: number } | null) => !!details)
      )
      .subscribe(details => {
        Logger.debug('TherapeuticProgramsListingComponent: Opening program details modal for id:', details.id);
        if (details?.id) {
          const itemToOpen: any = this.findSeminarById(details.id) || { id: details.id };
          this.openSeminarSubscription(itemToOpen, null);
          this._seminarItemFacade.openSeminarDetails.next(null);
        }
      });
    // this.moodModalIntegrationService.checkMoodModal();

    this.setUpFetchDataAfterLogin();
  }

  /** Set up listener to fetch data after login */
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .pipe(takeUntil(this._destroy$))
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('SupportGroupsLayoutComponent | currentUrl:', currentUrl);
        this.refreshLoginStatus();

        if (currentUrl.startsWith('/' + SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES) && this.isBrowser) {
          if (this.isLoggedIn()) {
            Logger.debug('SupportGroupsLayoutComponent: Fetching mySeminars after login');
            // Only fetch if not already loading to prevent duplicate calls
            if (!this._SeminarsFacade.isLoadingMySeminars()) {
              this._SeminarsFacade.fetchMySeminars();
            }
            if (!this._SeminarsFacade.isLoadingAllSeminars()) {
              this._SeminarsFacade.fetchAllSeminars(1, false, false);
            }
          } else {
            Logger.debug('SupportGroupsLayoutComponent: User logged out, resetting mySeminars');
            this._SeminarsFacade.resetSeminarsListState('myPrograms');
            Logger.debug('SupportGroupsLayoutComponent: Fetching allSeminars after logout');
            if (!this._SeminarsFacade.isLoadingAllSeminars()) {
              this._SeminarsFacade.fetchAllSeminars(1, false, false);
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  handleAllSeminarsPageChange(page: number): void {
    Logger.debug(`SupportGroupsComponent: All Seminars - Page change requested to ${page}`);
    this._SeminarsFacade.fetchAllSeminars(page);
  }

  handleMySeminarsPageChange(page: number): void {
    Logger.debug(`SupportGroupsComponent: My Seminars - Page change requested to ${page}`);
    if (this.isLoggedIn()) {
      this._SeminarsFacade.fetchMySeminars(page);
    }
  }

  protected handleLocalPageChange(page: number): void {
    console.log('SupportGroupsLayoutComponent: Local page change to', page);
    this._currentPage.set(page);

    // Scroll to top when page changes
    this.scrollToTop();
  }

  private findSeminarById(id: number): ISeminarItemDto | undefined {
    return this._SeminarsFacade.mySeminars()?.data?.find(seminar => seminar.id === id);
  }

  private scrollToTop(): void {
    if (this.isBrowser) {
      // Scroll to the top of the group cards section
      const groupCardsElement = document.querySelector('.support-groups-layout__group-cards');
      if (groupCardsElement) {
        groupCardsElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  private setSeoMeta(): void {
    const { title, meta } = SupportGroupsRouteData.SupportGroupsMainPage;
    const lang = this._localizationService.getCurrentLanguage() as keyof typeof title;
    this._seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'support gropus, seminars, mental health, therapy, wellness, support, mindfulness, anxiety, depression, stress management, self-care, online therapy, talbinah',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/support-groups',
      robots: 'index, follow',
      locale: this._localizationService.getCurrentLanguage(),
      canonical: 'https://talbinah.com/support-groups'
    });
  }

  protected openSeminarSubscription(item: ISeminarItemDto | undefined, paymentStatus: boolean | null): void {
    if (this.isBrowser) {
      Logger.debug('SupportGroupsComponent => openSeminarSubscription : ', {
        item: item,
        paymentStatus: paymentStatus
      });
      this.modalService.open(SupportGroupSubscriptionComponent, {
        inputs: {
          ...DetailsHeaderConfig,
          data: {
            item: item,
            paymentStatus: paymentStatus
          }
        },
        outputs: {
          closed: (response: any) => {
            Logger.debug('The update model is closed => response: ', response);
          }
        },
        width: '70%'
      });
    }
  }

  @ViewChild('card') cardRef!: ElementRef;
  headerConfig: IHeaderConfig = {
    image: 'images/supportGroups/icons/supportGroups.png',
    title: 'support_sessions_page_header_title',
    subtitle: 'support_sessions_page_header_description'
  };
  selectedMethod = signal<string | null>(null);
  successStep = signal<boolean | null>(false);

  isFullscreen: boolean = false;

  protected goHome(): void {
    if (this.isBrowser) this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (this.isBrowser) {
      const cardEl = this.cardRef.nativeElement;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch((err: any) => {
          console.error('Failed to enter fullscreen:', err);
          this.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }

  protected handleSelected(method: string): void {
    this.selectedMethod.set(method);
    console.log(method)
  }
  protected handleBack(): void {
    this.selectedMethod.set(null)
  }
  protected handleNext(): void {
    this.successStep.set(true)
  }

  openSubscriptionModal() {
    if (this.isBrowser) {
      this.modalService.open(SupportGroupSubscriptionComponent, {
        inputs: {
          image: 'images/mentalHealthScale/icons/talbinah.png',
          title: 'confirm_subscription',
        },
        outputs: {
          closed: () => {
            console.log('The model is closed');
          }
        }
      });
    }
  }
  protected openAllSupportGroups(type: string): void {
    if (this.isBrowser) {
      this.modalService.open(AllSupportGroupsComponent,
        {
          inputs: {
            type: type,
            image: 'images/supportGroups/icons/supportGroups.png',
            title: type == 'myGroups' ? 'my_support_sessions' : 'support_sessions'
          },
          width: '60%',
          minHeight: '40vh',
          maxHeight: '80%',
        }
      )
    }
  }
}
