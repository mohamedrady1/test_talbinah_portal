import { inject, Injectable, computed, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { ALL_APPOINTMENT_CATEGORY_ITEM, APPOINTMENT_CATEGORIES } from '../constants';
import { IAppointmentCategory } from '../models';
import { IReservationsListingResponseDto } from '../dtos';

import { ApiError, defaultPaginationParameters, handleApiErrors, IPaginationParameters, Logger, IApiResponse } from '../../../common';
import { InputSearchConfig, PaginationConfig } from '../../../shared';

import { IReservationsListState, initialReservationsListState } from '../models/reservations-list-states.model';
import { IGlobalReservationModel } from '../models/reservation-item.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationsListFacade {
  private _appointmentsApiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private platformId = inject(PLATFORM_ID);

  private state = signal<IReservationsListState>(initialReservationsListState);
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 10, total: 10 };
  private _currentPage = signal<number>(1);
  private _totalPages = signal<number>(1);
  private _searchControl = new FormControl<string>('', { nonNullable: true });
  private _searchSuggestions = signal<string[]>([]);
  private _selectedDates = signal<Date[] | null>(null);
  private _minDate = signal<Date>(new Date());
  private _maxDate = signal<Date>(new Date());
  private _appointmentCategories = computed(() => APPOINTMENT_CATEGORIES);
  private _selectedTab = signal<IAppointmentCategory | null>(null);
  private _todayCurrentAppointments = signal<IGlobalReservationModel[]>([]);
  private _isLoadingTodayCurrentAppointments = signal<boolean>(false);
  private _todayCurrentAppointmentsErrorMessage = signal<string | null>(null);
  private _todayCurrentAppointmentsStatus = signal<boolean | null>(null);

  constructor() {
    this.initializeDates();
    this._selectedTab.set(ALL_APPOINTMENT_CATEGORY_ITEM);
  }

  // Public signals
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
    onPageChange: (page: number) => this.handlePageChange(page)
  }));
  readonly selectedDates = this._selectedDates;
  readonly minDate = this._minDate;
  readonly maxDate = this._maxDate;
  readonly todayCurrentAppointments = computed(() => this._todayCurrentAppointments());
  readonly isLoadingTodayCurrentAppointments = computed(() => this._isLoadingTodayCurrentAppointments());
  readonly todayCurrentAppointmentsErrorMessage = computed(() => this._todayCurrentAppointmentsErrorMessage());
  readonly todayCurrentAppointmentsStatus = computed(() => this._todayCurrentAppointmentsStatus());

  private initializeDates(): void {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 18);

    const maxDate = new Date(minDate);
    maxDate.setMonth(minDate.getMonth() + 2);

    this._minDate.set(minDate);
    this._maxDate.set(maxDate);
  }

  resetFilters(parent_id?: string): void {
    this.reinitializePaginationAndFilters();
    this.fetchAppointments(false, parent_id);
  }

  fetchAppointments(filter: boolean = false, parent_id?: string): void {
    this.updateState({
      errorMessage: '',
      status: null,
      ...(filter ? { isLoadingFilter: true } : { isLoading: true })
    });

    const paramsToSend: IPaginationParameters = {
      ...this._paginationParams,
      status: undefined,
      is_start: undefined,
      is_end: undefined,
      category_id: undefined,
      search: this._searchControl.value || undefined,
      parent_id: parent_id || undefined
    };

    const selectedCategory = this._selectedTab();
    if (selectedCategory && selectedCategory.id !== ALL_APPOINTMENT_CATEGORY_ITEM.id) {
      paramsToSend.status = selectedCategory.status ?? undefined;
      paramsToSend.is_start = selectedCategory.is_start ?? undefined;
      paramsToSend.is_end = selectedCategory.is_end ?? undefined;
    }

    const selectedDates = this._selectedDates();
    if (selectedDates?.length) {
      paramsToSend.from_date = selectedDates[0].toISOString().split('T')[0];
      paramsToSend.to_date = selectedDates[1]?.toISOString().split('T')[0];
    }

    this._appointmentsApiClient.getAllReservations(paramsToSend)
      .pipe(
        tap((response: IReservationsListingResponseDto) => this.processAppointmentsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchAppointmentsError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeFetchAppointments(filter))
      )
      .subscribe();
  }

  getTodayCurrentAppointments(parent_id?: string): void {
    this._isLoadingTodayCurrentAppointments.set(true);
    this._todayCurrentAppointmentsErrorMessage.set(null);
    this._todayCurrentAppointmentsStatus.set(null);

    const today = new Date();
    const formattedTodayDate = today.toISOString().split('T')[0];

    const params: IPaginationParameters = {
      ...defaultPaginationParameters,
      status: 1,
      is_start: 1,
      is_end: 0,
      from_date: formattedTodayDate,
      per_page: 100,
      page: 1,
      parent_id: parent_id || undefined
    };

    this._appointmentsApiClient.getAllReservations(params)
      .pipe(
        tap((response: IReservationsListingResponseDto) => {
          if (response.status && response.data?.reservations?.data) {
            this._todayCurrentAppointments.set(response.data.reservations.data as IGlobalReservationModel[]);
            this._todayCurrentAppointmentsStatus.set(true);
          } else {
            const message = response.message || 'No current appointments found for today.';
            this._todayCurrentAppointments.set([]);
            this._todayCurrentAppointmentsStatus.set(false);
            this._todayCurrentAppointmentsErrorMessage.set(message);
          }
        }),
        catchError((error: ApiError) => {
          handleApiErrors(error);
          this._todayCurrentAppointments.set([]);
          this._todayCurrentAppointmentsStatus.set(false);
          this._todayCurrentAppointmentsErrorMessage.set('Failed to load today\'s current appointments');
          return EMPTY;
        }),
        finalize(() => this._isLoadingTodayCurrentAppointments.set(false))
      )
      .subscribe();
  }

  handlePageChange(page: number, parent_id?: string): void {
    this._currentPage.set(page);
    this._paginationParams.page = page;
    this.fetchAppointments(true, parent_id);
  }

  handleSearch(value: string, parent_id?: string): void {
    this._paginationParams.search = value;
    this.fetchAppointments(true, parent_id);
  }

  handleClearSearch(parent_id?: string): void {
    this._paginationParams.search = undefined;
    this._searchControl.setValue('');
    this.fetchAppointments(true, parent_id);
  }

  onTabCategorySelected(selectedTab: IAppointmentCategory, parent_id?: string): void {
    this._selectedTab.set(selectedTab);
    this._paginationParams.page = 1;
    this._currentPage.set(1);
    this.fetchAppointments(true, parent_id);
  }

  onDateSelect(from: string | null, to: string | null, parent_id?: string): void {
    Logger.debug('onDateSelect from: ', from, 'to: ', to);
    this._paginationParams.from_date = from;
    this._paginationParams.to_date = to;
    this._paginationParams.page = 1;
    this._currentPage.set(1);

    if (from && to) {
      this._selectedDates.set([new Date(from), new Date(to)]);
    } else if (from) {
      this._selectedDates.set([new Date(from)]);
    } else {
      this._selectedDates.set(null);
    }

    this.fetchAppointments(true, parent_id);
  }

  private processAppointmentsResponse(response: IReservationsListingResponseDto): void {
    if (response.status && response.data?.reservations?.data) {
      this.updateState({
        appointmentsResponse: response,
        reservationsList: response.data.reservations.data as IGlobalReservationModel[],
        totalItems: response.data.reservations.meta.total,
        errorMessage: '',
        status: true
      });
      this._totalPages.set(Math.ceil(response.data.reservations.meta.total / this._paginationParams.total!));
    } else {
      const errorMessage = response.message || 'No appointments found.';
      this.updateState({
        appointmentsResponse: null,
        reservationsList: [],
        errorMessage: errorMessage,
        status: false
      });
      this._searchSuggestions.set([]);
    }
  }

  private handleFetchAppointmentsError(error: ApiError): void {
    Logger.error('Error fetching appointments:', error);
    handleApiErrors(error);
    this.updateState({
      errorMessage: 'Error loading appointments. Please try again later.',
      status: false,
      reservationsList: []
    });
  }

  private finalizeFetchAppointments(filter?: boolean): void {
    this.updateState({
      ...(filter ? { isLoadingFilter: false } : { isLoading: false }),
      ...(this.state().status === true ? { errorMessage: '' } : {})
    });
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
