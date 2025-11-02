import { inject, Injectable, computed, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';


import { ApiError, defaultPaginationParameters, handleApiErrors, IPaginationParameters, Logger, IApiResponse } from '../../../common';
import { InputSearchConfig, PaginationConfig } from '../../../shared';
import { IAppointmentsApiClient, AppointmentsApiClientProvider, APPOINTMENT_CATEGORIES, ALL_APPOINTMENT_CATEGORY_ITEM, IReservationsListingResponseDto } from '../../appointments';
import { IReservationsListState, initialReservationsListState, IAppointmentCategory, IGlobalReservationModel } from '../../appointments/models';


@Injectable({
  providedIn: 'root'
})
export class VisitsReportsListFacade {
  // --- Injected Dependencies ---
  private _appointmentsApiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private platformId = inject(PLATFORM_ID);

  // --- Internal State Management (Signals) ---
  private state = signal<IReservationsListState>(initialReservationsListState);

  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10, total: 10 };
  private _currentPage = signal<number>(1);
  private _totalPages = signal<number>(1);

  // Search
  private _searchControl = new FormControl<string>('', { nonNullable: true });
  private _searchSuggestions = signal<string[]>([]);

  // Calendar
  private _selectedDates = signal<Date[] | null>(null);
  private _minDate = signal<Date>(new Date());
  private _maxDate = signal<Date>(new Date());

  // Appointment Categories (Static data)
  private _appointmentCategories = computed(() => APPOINTMENT_CATEGORIES);
  private _selectedTab = signal<IAppointmentCategory | null>(null);

  constructor() {
    this.initializeDates();
    this._selectedTab.set(ALL_APPOINTMENT_CATEGORY_ITEM);
  }

  // --- Public Read-only Signals (Exposed to Components) ---
  readonly appointmentsResponse = computed(() => this.state().appointmentsResponse);
  readonly reservationsList = computed(() => this.state().reservationsList);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly isLoadingFilter = computed(() => this.state().isLoadingFilter);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly totalItems = computed(() => this.state().totalItems);
  readonly currentPage = computed(() => this._currentPage());
  readonly totalPages = computed(() => this._totalPages());
  readonly appointmentCategories = this._appointmentCategories;
  readonly selectedTab = this._selectedTab;
  readonly status = computed(() => this.state().status);

  readonly searchConfig = computed<InputSearchConfig>(() => ({
    formControl: this._searchControl,
    placeholder: 'search2',
    suggestions: this._searchSuggestions(),
    debounceMs: 500,
    persistKey: 'appointments-search-topic',
    autoFocus: false,
    emitWhenClick: false
  }));

  readonly paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this._currentPage(),
    totalPages: this._totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  }));

  readonly selectedDates = this._selectedDates;
  readonly minDate = this._minDate;
  readonly maxDate = this._maxDate;


  // --- Public Methods (Business Logic) ---

  private initializeDates(): void {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 18);

    const maxDate = new Date(minDate);
    maxDate.setMonth(minDate.getMonth() + 2);

    this._minDate.set(minDate);
    this._maxDate.set(maxDate);
    Logger.debug('Dates initialized in Facade: ', {
      min: this._minDate(),
      max: this._maxDate()
    });
  }

  fetchVisitsReports(filter: boolean = false): void {
    Logger.debug('Initiating appointments fetch from Facade...');
    this.updateState({ errorMessage: '', status: null });

    if (filter) {
      this.updateState({ isLoadingFilter: true, errorMessage: '🔄 Filtering appointments... Please wait.' });
    } else {
      this.updateState({ isLoading: true, errorMessage: '🔄 Loading appointments... Please wait.' });
    }

    const paramsToSend: IPaginationParameters = {
      ...defaultPaginationParameters,
      status: undefined,
      is_start: 1,
      is_end: 1,
      search: undefined,
      category_id: undefined
    };

    const selectedCategory = this._selectedTab();
    if (selectedCategory && selectedCategory.id !== ALL_APPOINTMENT_CATEGORY_ITEM.id) {
      paramsToSend.status = selectedCategory.status !== null ? selectedCategory.status : undefined;
      paramsToSend.is_start = selectedCategory.is_start !== null ? selectedCategory.is_start : undefined;
      paramsToSend.is_end = selectedCategory.is_end !== null ? selectedCategory.is_end : undefined;
    }

    const selectedDates = this._selectedDates();
    if (selectedDates && selectedDates.length) {
      paramsToSend.from_date = selectedDates[0].toISOString().split('T')[0];
      paramsToSend.to_date = selectedDates[1].toISOString().split('T')[0];
    } else {
      paramsToSend.from_date = undefined;
      paramsToSend.to_date = undefined;
    }

    this._appointmentsApiClient.getAllReservations(paramsToSend)
      .pipe(
        tap((response: IReservationsListingResponseDto) => this.processAppointmentsResponse(response)),
        catchError((error: ApiError) => {
          this.handlefetchVisitsReportsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizefetchVisitsReports(filter))
      )
      .subscribe();
  }

  handlePageChange(page: number): void {
    this._currentPage.set(page);
    Logger.debug('Page changed to:', this._currentPage());
    this._paginationParams.page = page;
    this.fetchVisitsReports(true);
  }

  handleSearch(value: string): void {
    Logger.debug('Search term entered:', value);
    this._paginationParams.search = value;
    // this.reinitializePaginationAndFilters();
    this.fetchVisitsReports(true);
  }

  handleClearSearch(): void {
    Logger.debug('Search cleared');
    this._paginationParams.search = undefined;
    this._searchControl.setValue('');
    this.reinitializePaginationAndFilters();
    this.fetchVisitsReports(true);
  }

  onTabCategorySelected(selectedTab: IAppointmentCategory): void {
    Logger.debug('Tab category selected in Facade:', selectedTab);
    this._selectedTab.set(selectedTab);
    this._paginationParams.page = 1;
    this._currentPage.set(1);
    this.fetchVisitsReports(true);
  }

  onDateSelect(from: string | null, to: string | null): void {
    this._paginationParams.from_date = from;
    this._paginationParams.to_date = to;
    this._currentPage.set(1);
    // Convert from/to (string | null) to Date[] | null
    if (from && to) {
      this._selectedDates.set([new Date(from), new Date(to)]);
    } else if (from) {
      this._selectedDates.set([new Date(from)]);
    } else {
      this._selectedDates.set(null);
    }
    this.fetchVisitsReports(true);
  }
  // --- Private Helper Methods ---

  private processAppointmentsResponse(response: IReservationsListingResponseDto): void {
    Logger.debug('Appointments Listing Response in Facade: ', response);

    if (response.status && response.data && response.data.reservations && response.data.reservations.data) {
      this.updateState({
        appointmentsResponse: response,
        reservationsList: response.data.reservations.data as IGlobalReservationModel[],
        totalItems: response.data.reservations.meta.total,
        errorMessage: '',
        status: true
      });

      this._totalPages.set(Math.ceil(response.data.reservations.meta.total / this._paginationParams.total!));

      Logger.debug('Appointments fetched successfully in Facade:', response);
    } else {
      const errorMessage = response.message || '📭 No appointments found.';
      this.updateState({
        appointmentsResponse: null,
        reservationsList: [],
        errorMessage: errorMessage,
        status: false
      });
      this._searchSuggestions.set([]);
    }
  }

  private handlefetchVisitsReportsError(error: ApiError): void {
    Logger.error('Error fetching appointments in Facade:', error);
    handleApiErrors(error);
    this.updateState({
      errorMessage: '🚨 Error loading appointments. Please try again later.',
      status: false,
      reservationsList: []
    });
  }

  private finalizefetchVisitsReports(filter?: boolean): void {
    if (filter) {
      this.updateState({ isLoadingFilter: false });
    } else {
      this.updateState({ isLoading: false });
    }
    if (this.state().status === true) {
      this.updateState({ errorMessage: '' });
    }
  }

  private reinitializePaginationAndFilters(): void {
    this._paginationParams = { ...defaultPaginationParameters, per_page: 10, total: 10 };
    this._currentPage.set(1);
    this._totalPages.set(1);

    this._searchControl.setValue('');
    this._searchSuggestions.set([]);
    this._selectedDates.set(null);

    this._selectedTab.set(ALL_APPOINTMENT_CATEGORY_ITEM);

    this.updateState({
      appointmentsResponse: null,
      reservationsList: null,
      isLoading: false,
      isLoadingFilter: false,
      errorMessage: '',
      totalItems: 0,
      status: null
    });
  }

  private updateState(updates: Partial<IReservationsListState>): void {
    this.state.update(current => ({ ...current, ...updates }));
  }
}
