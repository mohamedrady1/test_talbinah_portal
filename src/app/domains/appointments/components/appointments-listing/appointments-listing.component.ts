import { EmptyStateCardComponent, ErrorStateCardComponent, GlobalSearchInputComponent, ILayoutGridHeaderConfig, ModalService, PageLayoutHeaderComponent, PaginationListingComponent } from '../../../../shared';
import { GetReservations, ReservationsEmptyState, ReservationsListHeaderConfig, ReservationsOngoingEmptyState, YourReservationsEmptyState } from '../../configs';
import { ChangeDetectionStrategy, Component, ElementRef, inject, PLATFORM_ID, signal, ViewChild, computed } from '@angular/core';
import { AppointmentCardSkeletonComponent } from '../appointment-card-skeleton';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppointmentCardComponent } from '../appointment-card';
import { ActivatedRoute, Router } from '@angular/router';
import { MainPageRoutesEnum } from '../../../main-page';
import { ReservationsListFacade } from '../../services';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { CardType, Logger } from '../../../../common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { PaymentPageTypeEnum, PaymentStateService, RoutePaymentInfo } from '../../../payments';
import { ReservationDetailsFacade } from '../../services/reservation-details.facade';
import { SessionDetailsModalComponent } from '../session-details-modal';
import { TranslationsFacade } from '../../../../common/core/translations/services';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'app-appointments-listing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GlobalSearchInputComponent,
    PaginationListingComponent,
    AppointmentCardComponent,
    FormsModule,
    DatePickerModule,
    AutoExactHeightDirective,
    AppointmentCardSkeletonComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    PageLayoutHeaderComponent,
    
  ],
  templateUrl: './appointments-listing.component.html',
  styleUrls: ['./appointments-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsListingComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private _activatedRoute = inject(ActivatedRoute);
  protected readonly facade = inject(ReservationsListFacade);
  private readonly _router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  protected readonly reservationFacade = inject(ReservationDetailsFacade);
  readonly appointmentTypeId = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map(params => params.get('typeId') ?? '')
    )
  );

  // Signals
  readonly appointmentsResponse = this.facade.appointmentsResponse;
  readonly isLoading = this.facade.isLoading;
  readonly isLoadingFilter = this.facade.isLoadingFilter;
  readonly errorMessage = this.facade.errorMessage;
  readonly totalItems = this.facade.totalItems;
  readonly appointmentCategories = this.facade.appointmentCategories;
  readonly selectedTab = this.facade.selectedTab;
  readonly searchConfig = this.facade.searchConfig;
  readonly paginationConfig = computed(() => ({
    ...this.facade.paginationConfig(),
    onPageChange: (page: number) => this.facade.handlePageChange(page, this.appointmentTypeId())
  }));
  readonly selectedDates = this.facade.selectedDates;
  readonly minDateSignal = this.facade.minDate;
  readonly maxDateSignal = this.facade.maxDate;
  readonly isLoadingTodayCurrentAppointments = this.facade.isLoadingTodayCurrentAppointments;
  readonly todayAppointmentsList = this.facade.todayCurrentAppointments;
  readonly todayCurrentAppointmentsErrorMessage = this.facade.todayCurrentAppointmentsErrorMessage;
  readonly todayCurrentAppointmentsStatus = this.facade.todayCurrentAppointmentsStatus;

  protected reservationsEmptyState = ReservationsEmptyState;
  protected reservationsOngoingEmptyState = ReservationsOngoingEmptyState;
  protected yourReservationsEmptyState = YourReservationsEmptyState;
  protected readonly reservationsErrorState = GetReservations(() => this.facade.errorMessage);
  protected cardFire: CardType = CardType.FIRE;
  readonly headerConfig: ILayoutGridHeaderConfig = ReservationsListHeaderConfig;
  @ViewChild('card') cardRef!: ElementRef;
  readonly isFullscreen = signal(false);

  protected dateRange: Date[] | null = null;
  protected dateRangeObject: DateRange = { startDate: null, endDate: null };

  private readonly _paymentStateService = inject(PaymentStateService);
  private readonly _destroy$ = new Subject<void>();
  private readonly _ModalService = inject(ModalService);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const typeId = this.appointmentTypeId();
    if (typeId) {
      this.facade.resetFilters(typeId);
      this.facade.getTodayCurrentAppointments(typeId);
    }

    this._paymentStateService.routePaymentInfo$
      .pipe(takeUntil(this._destroy$))
      .subscribe((data: RoutePaymentInfo | null) => {
        Logger.debug('AppointmentsListingComponent: RoutePaymentInfo received:', data);

        if (data && (data.itemId != null || data.status === false)) {
          Logger.debug('AppointmentsListingComponent: handling payment result for itemId:', data.itemId);

          // ✅ 1. Open Status Info popup automatically
          this._paymentStateService.openPaymentStatusInfo({ ...data }, PaymentPageTypeEnum.RESERVATION);

          // ✅ 2. Clear query params from URL (SSR-safe)
          this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams: {
              typeId: typeId
            },
            replaceUrl: true
          });

          // ✅ 3. Clear in-memory payment state so it doesn't reopen
          this._paymentStateService.clearRoutePaymentInfo();
        }
      });

    this.reservationFacade.openReservationDetails
      .pipe(
        takeUntil(this._destroy$),
        filter((details: { id: number } | null) => !!details)
      )
      .subscribe(details => {
        if (details?.id) {
          this._ModalService.open(SessionDetailsModalComponent, {
            inputs: {
              image: 'images/home/icons/date.png',
              title: 'appointment_details',
              subtitle: 'appointments_list_page_subtitle',
              item: details
            },
            outputs: {
              closed: () => {
                console.log('The model is closed');
              }
            },
            width: '50%',
            height: '75%'
          });
          this.reservationFacade.openReservationDetails.next(null);
        }
      });
  }

  // Event handlers
  protected handleSearch(value: string): void {
    this.facade.handleSearch(value, this.appointmentTypeId());
  }

  protected handleClearSearch(): void {
    this.facade.handleClearSearch(this.appointmentTypeId());
  }

  protected onTabCategorySelected(selectedTab: any): void {
    this.facade.onTabCategorySelected(selectedTab, this.appointmentTypeId());
  }

  protected handleRangeSelect(event: Date | Date[] | null): void {
    if (!event) {
      this.dateRangeObject = { startDate: null, endDate: null };
      this.onDateSelect(null, null);
      return;
    }

    const clickedDate = Array.isArray(event) ? event[0] : event;
    let newRange = { ...this.dateRangeObject };

    if (!newRange.startDate) {
      newRange = { startDate: clickedDate, endDate: null };
    } else if (!newRange.endDate) {
      newRange = clickedDate >= newRange.startDate
        ? { ...newRange, endDate: clickedDate }
        : { startDate: clickedDate, endDate: null };
    } else {
      newRange = { startDate: clickedDate, endDate: null };
    }

    this.dateRangeObject = newRange;

    const formatDate = (d: Date | null) => d ? this.toISODate(d) : null;
    this.onDateSelect(formatDate(this.dateRangeObject.startDate), formatDate(this.dateRangeObject.endDate));
  }

  protected handleRangeReset(): void {
    this.dateRange = null;
    this.dateRangeObject = { startDate: null, endDate: null };
    this.onDateSelect(null, null);
  }

  protected onDateSelect(from: string | null, to: string | null): void {
    if ((this.dateRangeObject.startDate && this.dateRangeObject.endDate) || (!from && !to)) {
      this.facade.onDateSelect(from, to, this.appointmentTypeId());
    }
  }

  protected navigateToHomePage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleSessionFullscreen(): void {
    if (!isPlatformBrowser(this.platformId) || !this.cardRef?.nativeElement) return;

    const cardEl = this.cardRef.nativeElement;
    if (!document.fullscreenElement) {
      cardEl.requestFullscreen().then(() => this.isFullscreen.set(true));
    } else {
      document.exitFullscreen().then(() => this.isFullscreen.set(false));
    }
  }

  // ---------------------
  // Convert date to YYYY-MM-DD string (timezone-free)
  // ---------------------
  private toISODate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

