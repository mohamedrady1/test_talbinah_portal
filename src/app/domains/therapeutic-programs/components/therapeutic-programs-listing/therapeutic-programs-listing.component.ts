import { Component, OnInit, inject, computed, OnDestroy, signal, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { TherapeuticProgramsFacade } from '../../services/therapeutic-programs.facade';
import { TherapeuticProgramCardComponent } from '../therapeutic-program-card';
import {
  CompeleteDataAndRegisterNowComponent,
  EmptyStateComponent,
  ErrorStateComponent,
  ICardHeaderConfig,
  LocalizationService,
  ModalService,
  PaginationConfig,
  PaginationListingComponent,
  StorageKeys,
  SegmentControlComponent,
  SegmentOption,
} from '../../../../shared';
import { CardType, MetadataService, Logger, StorageService } from '../../../../common';
import { TherapeuticProgramsRouteData, TherapeuticProgramsRoutesEnum } from '../../constants';
import {
  DetailsHeaderConfig,
  EmptyState,
  exploreTherapyProgramsHeader,
  getError,
  myTherapyProgramsHeader,
} from '../../configs';
import { TherapeuticProgramCardShimmerComponent } from '../therapeutic-program-card-shimmer';
import { ProgramSubscriptionPopupComponent } from '../program-subscription-popup';
import { ITherapeuticProgram } from '../../models';
import { PaymentPageTypeEnum, PaymentStateService, RoutePaymentInfo, StatusInfoComponent } from '../../../payments';
import { AllTherapeuticProgramsComponent } from '../all-therapeutic-programs';
import { CardHeaderComponent } from '../../../mental-health-scales';
import { TherapeuticProgramItemFacade } from '../../services';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { PodcastRoutesEnum } from '../../../podcasts';
import { ArticlesRoutesEnum } from '../../../articles';

@Component({
  selector: 'app-therapeutic-programs-listing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardHeaderComponent,
    TherapeuticProgramCardComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    TherapeuticProgramCardShimmerComponent,
    PaginationListingComponent,
    CompeleteDataAndRegisterNowComponent,
    SegmentControlComponent
  ],
  templateUrl: './therapeutic-programs-listing.component.html',
  styleUrls: ['./therapeutic-programs-listing.component.scss'],
})
export class TherapeuticProgramsListingComponent implements OnInit, OnDestroy {
  // --- Injected Dependencies ---
  private readonly modalService = inject(ModalService);
  protected readonly _programsFacade = inject(TherapeuticProgramsFacade);
  private readonly _seo = inject(MetadataService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroy$ = new Subject<void>();
  private readonly _paymentStateService = inject(PaymentStateService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _UserContextService = inject(UserContextService);
  // --- UI Configs ---
  exploreTherapyProgramsHeader: ICardHeaderConfig = exploreTherapyProgramsHeader;
  myTherapyProgramsHeader: ICardHeaderConfig = myTherapyProgramsHeader;
  protected cardType = CardType;
  protected readonly emptyState = EmptyState;

  protected allProgramsErrorState = signal<any | null>(null);
  protected myProgramsErrorState = signal<any | null>(null);

  protected allProgramsLoaded = signal(false);
  protected myProgramsLoaded = signal(false);


  private _programItemFacade = inject(TherapeuticProgramItemFacade);
  // Pagination configuration for 'All Programs'
  readonly allProgramsPaginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this._programsFacade.currentAllProgramsPage(),
    totalPages: this._programsFacade.totalAllProgramsPages(),
    onPageChange: (page: number) => this.handleAllProgramsPageChange(page),
  }));

  // Pagination configuration for 'My Programs'
  readonly myProgramsPaginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this._programsFacade.currentMyProgramsPage(),
    totalPages: this._programsFacade.totalMyProgramsPages(),
    onPageChange: (page: number) => this.handleMyProgramsPageChange(page),
  }));

  // --- Local Pagination State ---
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(6); // 6 items per page

  // Local pagination configuration for displayed items
  readonly localPaginationConfig = computed<PaginationConfig>(() => {
    const allData = this._programsFacade.allPrograms()?.data || [];
    const totalItems = allData.length;
    const totalPages = Math.ceil(totalItems / this._itemsPerPage());

    return {
      currentPage: this._currentPage(),
      totalPages: totalPages,
      onPageChange: (page: number) => this.handleLocalPageChange(page)
    };
  });

  // Get paginated data for current page
  readonly paginatedPrograms = computed(() => {
    const allData = this._programsFacade.allPrograms()?.data || [];
    const currentPage = this._currentPage();
    const itemsPerPage = this._itemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allData.slice(startIndex, endIndex);
  });


  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);

  // ----- Auth / Guest Signals -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => !!this.token());

  // Segment control for mobile view
  protected readonly selectedSegmentId = signal<string>('allPrograms');
  protected readonly isMobileView = signal<boolean>(false);

  protected readonly segmentOptions: SegmentOption[] = [
    { id: 'allPrograms', title: 'explore_treatment_programs' },
    { id: 'myPrograms', title: 'your_treatment_programs' }
  ];

  // Show/hide logic for sections
  protected readonly showAllPrograms = computed(() =>
    !this.isMobileView() || this.selectedSegmentId() === 'allPrograms'
  );
  protected readonly showMyPrograms = computed(() =>
    !this.isMobileView() || this.selectedSegmentId() === 'myPrograms'
  );

  constructor() {
    this.setSeoMeta();

    // Reactively track All Programs
    effect(() => {
      const allPrograms = this._programsFacade.allPrograms();
      if (allPrograms) {
        this.allProgramsLoaded.set(true);
        this.allProgramsErrorState.set(
          getError(() => this._programsFacade.fetchAllTherapeuticPrograms(this._programsFacade.currentAllProgramsPage()))
        );
      }
      if (!this._programsFacade.isFilteringAllPrograms()) {
        this.myProgramsLoaded.set(true);
      }
    });

    // Reactively track My Programs
    effect(() => {
      const myPrograms = this._programsFacade.myPrograms();
      if (myPrograms) {
        this.myProgramsLoaded.set(true);
        this.myProgramsErrorState.set(
          getError(() => this._programsFacade.fetchMyTherapeuticPrograms(this._programsFacade.currentMyProgramsPage()))
        );
      }
      if (!this._programsFacade.isLoadingMyPrograms()) {
        this.myProgramsLoaded.set(true);
      }
    });

    // "All" button visibility
    effect(() => {
      const myProgramsDataLength = this._programsFacade.myPrograms()?.data?.length ?? 0;
      const displayedCount = 4;
      this.myTherapyProgramsHeader.isAllButtonVisible = myProgramsDataLength > displayedCount;
    });
  }


  ngOnInit(): void {
    // Check if mobile view
    if (this.isBrowser) {
      this.isMobileView.set(window.innerWidth < 768);
      // Listen for window resize
      window.addEventListener('resize', () => {
        this.isMobileView.set(window.innerWidth < 768);
      });
    }

    // --- Existing fetches ---

    this.setUpFetchDataAfterLogin();

    this._paymentStateService.routePaymentInfo$
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: RoutePaymentInfo | null) => {
        if (data && (data.itemId != null || data.status === false)) {
          this._paymentStateService.openPaymentStatusInfo({ ...data }, PaymentPageTypeEnum.PROGRAM);
          this.router.navigate([], { relativeTo: this._activatedRoute, queryParams: {}, replaceUrl: true });
          this._paymentStateService.clearRoutePaymentInfo();
        }
      });

    this._programItemFacade.openProgramDetails
      .pipe(
        takeUntil(this._destroy$),
        filter(details => !!details?.id)
      )
      .subscribe(details => {
        if (details?.id) {
          this.openProgramSubscription({ id: details.id } as ITherapeuticProgram, null);
          this._programItemFacade.openProgramDetails.next(null);
        }
      });

    // ===== SSR-safe auto-open based on route param `:id` =====
    if (isPlatformBrowser(this.platformId)) {
      const routeId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
      if (!isNaN(routeId)) {
        if (routeId) {
          Logger.debug('TherapeuticProgramsListingComponent | Auto-opening program subscription for route param id:', routeId);
          this.openProgramSubscription({ id: routeId } as ITherapeuticProgram, null);
          this._programItemFacade.openProgramDetails.next(null);
        } else {
          Logger.debug('TherapeuticProgramsListingComponent | Program not found for route param id:', routeId);
          // Optionally: show toast or navigate back
          return;
        }
      }
    }

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // --- Event Handlers (delegating to Facade) ---
  handleAllProgramsPageChange(page: number): void {
    Logger.debug(`All Programs → page change to ${page}`);
    this._programsFacade.fetchAllTherapeuticPrograms(page);
  }

  handleMyProgramsPageChange(page: number): void {
    Logger.debug(`My Programs → page change to ${page}`);
    this._programsFacade.fetchMyTherapeuticPrograms(page);
  }

  protected handleLocalPageChange(page: number): void {
    this._currentPage.set(page);
  }

  // --- SEO Meta Data ---
  private setSeoMeta(): void {
    const { title, meta } = TherapeuticProgramsRouteData.TherapeuticProgramsMainPage;
    const lang = this._localizationService.getCurrentLanguage() as keyof typeof title;
    this._seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords:
        'therapeutic programs, mental health, therapy, wellness, support, mindfulness, anxiety, depression, stress management, self-care, online therapy, talbinah',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/therapeutic-programs',
      robots: 'index, follow',
      locale: this._localizationService.getCurrentLanguage(),
      canonical: 'https://talbinah.com/therapeutic-programs',
    });
  }

  // --- Modals ---
  protected openProgramSubscription(item: ITherapeuticProgram, paymentStatus: boolean | null): void {
    Logger.debug('TherapeuticProgramsListingComponent | openProgramSubscription: ', {
      item: item,
      paymentStatus: paymentStatus
    })
    this.modalService.open(ProgramSubscriptionPopupComponent, {
      inputs: {
        ...DetailsHeaderConfig,
        data: { item, paymentStatus },
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('Program subscription modal closed → response:', response);
        },
      },
      width: '70%',
    });
  }
  private findProgramById(id: number): ITherapeuticProgram | undefined {
    const program = this._programsFacade.myPrograms()?.data?.find(program => program.id === id);
    if (program) {
      return program;
    }
    else {
      return undefined;
    }
  }
  protected openTherapeuticProgramsPopup(type: string): void {
    this.modalService.open(AllTherapeuticProgramsComponent, {
      inputs: {
        image: 'images/therapeutic-programs/book.png',
        title: type === 'exploreTherapyPrograms'
          ? exploreTherapyProgramsHeader.title
          : 'your_treatment_programsAll',
        type,
      },
      width: '60%',
      minHeight: '40vh',
      maxHeight: '80%',
      outputs: {
        closed: () => Logger.debug('All programs modal closed'),
      },
    });
  }
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this.router.url;
        Logger.debug('TherapeuticProgramsListingComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE) && this.isBrowser) {
          this.refreshLoginStatus();
          Logger.debug('TherapeuticProgramsListingComponent: User logged in, fetching my programs and all programs');

          if (this.isLoggedIn()) {
            Logger.debug('TherapeuticProgramsListingComponent: User logged in, fetching my programs and all programs');
            this._programsFacade.fetchMyTherapeuticPrograms();
            this._programsFacade.fetchAllTherapeuticPrograms();
          } else {
            this._programsFacade.resetMyPrograms();
            this._programsFacade.fetchAllTherapeuticPrograms();
          }
        }
      });
  }

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  protected onSegmentChanged(option: SegmentOption): void {
    this.selectedSegmentId.set(option.id as string);
  }
}
