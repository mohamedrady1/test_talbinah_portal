import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  effect,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import {
  ErrorStateCardComponent,
  GlobalSearchInputComponent,
  InputSearchConfig,
  PaginationConfig,
  PaginationListingComponent,
  StorageKeys,
  ModalService
} from '../../../../shared';
import { AsideFilterationComponent, AsideFilterationFormModel } from '../aside-filteration';
import { DoctorCardForBookingComponent } from '../doctor-card-for-booking';
import { DoctorsListFacade } from '../../services/doctors-list.facade';
import { CardType, IGlobalUserContactInfoModel, IPaginationParameters, Logger, StorageService } from '../../../../common';
import { DoctorCardForBookingSkeletonComponent } from '../doctor-card-for-booking-skeleton';
import { GetDoctors } from '../../configs';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Subject, takeUntil } from 'rxjs';
import { UserContextService } from '../../../authentication';
import { BookAppointmentRoutesEnum } from '../../constants';
import { BookApoointmentPopupComponent } from '../book-apoointment-popup';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-doctors-listing-for-booking',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    GlobalSearchInputComponent,
    PaginationListingComponent,
    DoctorCardForBookingComponent,
    AsideFilterationComponent,
    DoctorCardForBookingSkeletonComponent,
    ErrorStateCardComponent,
    
  ],
  templateUrl: './doctors-listing-for-booking.component.html',
  styleUrls: ['./doctors-listing-for-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorsListingForBookingComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private platformId = inject(PLATFORM_ID);
  private _ActivatedRoute = inject(ActivatedRoute);
  protected readonly facade = inject(DoctorsListFacade);
  private readonly _ModalService = inject(ModalService);

  protected cardTypes = CardType;
  protected readonly doctorsErrorState = GetDoctors(() => this.facade.fetch());
  protected readonly isLoading = this.facade.isLoading();

  protected readonly isMobile = signal(false);
  protected readonly authResetTick = signal(0);
  private hasOpenedPopup = false; // Flag to prevent multiple openings

  // Directly use appointmentTypeId from query params
  readonly appointmentTypeId = toSignal(
    this._ActivatedRoute.queryParamMap.pipe(
      map(params => params.get('typeId') ?? '')
    ),
    { initialValue: '' }
  );

  // Get doctorId from query params
  readonly doctorId = toSignal(
    this._ActivatedRoute.queryParamMap.pipe(
      map(params => params.get('doctorId') ?? '')
    ),
    { initialValue: '' }
  );

  // Search control & config
  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });
  protected readonly searchConfig = computed<InputSearchConfig>(() => ({
    formControl: this.searchControl,
    placeholder: 'search2',
    debounceMs: 500,
    persistKey: 'Doctors-search-topic',
    autoFocus: false,
    emitWhenClick: false
  }));

  // Local Pagination config
  protected readonly paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.facade.currentPage(),
    totalPages: this.facade.totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  }));

  // Check if searching
  protected readonly isSearching = computed(() => {
    const searchValue = this.searchControl.value;
    return searchValue && searchValue.trim().length > 0;
  });

  // ----- Injected services -----
  private readonly _UserContextService = inject(UserContextService);
  private readonly _StorageService = inject(StorageService);
  private readonly _Router = inject(Router);
  private readonly _destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const typeId = this.appointmentTypeId();
      if (typeId) {
        this.facade.updateFilters({ parent_id: typeId });
      }
    });

    // Effect to open popup when doctorId is in URL
    effect(() => {
      const docId = this.doctorId();
      if (docId && !this.hasOpenedPopup && isPlatformBrowser(this.platformId)) {
        // Set flag immediately to prevent multiple triggers
        this.hasOpenedPopup = true;
        // Small delay to ensure the component is fully initialized
        setTimeout(() => {
          this.openDoctorPopup(docId);
        }, 300);
      }
    });
  }

  ngOnInit(): void {
    // Reset filters initially
    this.facade.resetFilters();

    const typeId = this.appointmentTypeId();
    if (typeId) {
      this.facade.updateFilters({ parent_id: typeId });
    }

    this._UserContextService.recallUserDataViewed
      .pipe(takeUntil(this._destroy$))
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('DoctorsListingForBookingComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE)) {
          this.facade.resetFilters();

          const typeId = this.appointmentTypeId();
          if (typeId) {
            this.facade.updateFilters({ parent_id: typeId });
          }
          // Bump reset trigger for aside filter on login/logout
          this.authResetTick.update(v => v + 1);
        }
      });
  }

  private updateMobileFlag(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile.set(window.innerWidth <= 1200);
    }
  }

  protected handleSearch(value: string): void {
    this.facade.updateFilters({ search: value });
  }
  protected handleClearSearch(): void {
    this.facade.updateFilters({ search: undefined });
  }
  protected handlePageChange(page: number): void {
    this.facade.setPage(page);
  }
  protected handleFavouriteToggle(item: unknown): void {
    Logger.debug('DoctorsListingForBookingComponent => Favourite toggled:', item);
  }

  protected onFilterFormSubmitted(
    filters: Partial<IPaginationParameters> | AsideFilterationFormModel | Event
  ): void {
    if ((filters as Event).type) return;

    if ('specialty' in filters) {
      const asideFilters = filters as AsideFilterationFormModel;
      const mappedFilters: Partial<IPaginationParameters> = {
        ...asideFilters,
        parent_id: this.appointmentTypeId(),
        specialty: asideFilters.specialty ?? undefined,
        gender: asideFilters.gender ?? undefined,
        rate: asideFilters.rate ?? undefined
      };
      this.facade.updateFilters(mappedFilters);
    } else {
      this.facade.updateFilters(filters as Partial<IPaginationParameters>);
    }
  }

  /**
   * Opens the doctor booking popup for a specific doctor ID
   * @param doctorId The ID of the doctor to show in the popup
   */
  private openDoctorPopup(doctorId: string): void {
    Logger.debug('DoctorsListingForBookingComponent: Opening popup for doctor ID:', doctorId);

    // Remove doctorId from URL immediately before opening popup
    // This prevents the effect from triggering again
    this.removedoctorIdFromUrl();

    this._ModalService.open(BookApoointmentPopupComponent, {
      inputs: {
        image: 'images/home/icons/date.png',
        title: 'doctor_details',
        subtitle: 'book_appointment_modal_subtitle',
        doctorId: doctorId
      },
      outputs: {
        closed: () => {
          Logger.info('Book Appointment Modal closed from URL.');
        }
      },
      width: '70%',
    });
  }

  /**
   * Removes doctorId query parameter from URL
   */
  private removedoctorIdFromUrl(): void {
    const queryParams = { ...this._ActivatedRoute.snapshot.queryParams };
    delete queryParams['doctorId'];

    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: queryParams,
      replaceUrl: true // Use replaceUrl to avoid adding to browser history
    }).then(() => {
      // Reset flag after navigation completes
      setTimeout(() => {
        this.hasOpenedPopup = false;
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

