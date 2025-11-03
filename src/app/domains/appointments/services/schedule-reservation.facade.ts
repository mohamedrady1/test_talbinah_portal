// app/core/store/appointments/schedule-reservation.facade.ts

import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared'; // Adjust paths as necessary
import { IScheduleReservationRequestDto, IScheduleReservationResponseDto } from '../dtos';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { ReservationsListFacade } from './reservations-list.facade';

export interface IScheduleReservationState {
  isScheduling: boolean;
  scheduleSuccess: boolean;
  scheduleError: string | null;
  scheduledReservationResponse: IScheduleReservationResponseDto['data'] | null; // Stores the 'data' part of the response
}

export const initialScheduleReservationState: IScheduleReservationState = {
  isScheduling: false,
  scheduleSuccess: false,
  scheduleError: null,
  scheduledReservationResponse: null,
};

// Define a unique state key for Angular's TransferState for SSR hydration
const SCHEDULE_RESERVATION_STATE_KEY = makeStateKey<IScheduleReservationState>('scheduleReservationState');

@Injectable({
  providedIn: 'root',
})
export class ScheduleReservationFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private readonly _reservationsListFacade = inject(ReservationsListFacade);

  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _scheduleReservationState = signal<IScheduleReservationState>(initialScheduleReservationState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isScheduling = computed(() => this._scheduleReservationState().isScheduling);
  readonly scheduleSuccess = computed(() => this._scheduleReservationState().scheduleSuccess);
  readonly scheduleError = computed(() => this._scheduleReservationState().scheduleError);
  readonly scheduledReservation = computed(() => this._scheduleReservationState().scheduledReservationResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(SCHEDULE_RESERVATION_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating schedule reservation state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(SCHEDULE_RESERVATION_STATE_KEY); // Remove after hydration
      // }
    }
  }

  // --- Public Action Methods ---
  scheduleReservation(id: number, payload: IScheduleReservationRequestDto): void {
    Logger.debug(`Attempting to schedule reservation ${id} with payload:`, payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isScheduling: true,
      scheduleSuccess: false,
      scheduleError: null,
      scheduledReservationResponse: null,
    });

    this._apiClient.ScheduleReservationById(id, payload)
      .pipe(
        tap((response: IScheduleReservationResponseDto) => {
          if (response.status) {
            // Update state with successful response data
            this.updateState({
              scheduleSuccess: true,
              scheduledReservationResponse: response.data || null, // Store the 'data' part, or null
              scheduleError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(SCHEDULE_RESERVATION_STATE_KEY, this._scheduleReservationState());
              Logger.debug('Stored schedule reservation state in TransferState for SSR.');
            }
            // this._toastService.success(response.message || this._localizationService.translateTextFromJson('appointments.scheduleSuccess'));
            Logger.debug(`Reservation ${id} scheduled successfully:`, response.data);
            this._reservationsListFacade.getTodayCurrentAppointments();
            this._reservationsListFacade.resetFilters();
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('appointments.scheduleFailedGeneric');
            this.updateState({
              scheduleSuccess: false,
              scheduledReservationResponse: response.data || null,
              scheduleError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'an_error_has_occurredSchedulingReservation');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeScheduleOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire scheduling state to its initial values.
   */
  resetState(): void {
    this._scheduleReservationState.set(initialScheduleReservationState);
    Logger.debug('Schedule reservation state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<IScheduleReservationState>): void {
    this._scheduleReservationState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error scheduling reservation:`, error);
    handleApiErrors(error); // Call your common error handler
    // this._toastService.error(error?.message ?? this._localizationService.translateTextFromJson(translationKey));
    const errorMessage = error?.message || this._localizationService.translateTextFromJson('an_error_has_occurred');
    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
      detail: errorMessage,
      life: 5000
    });
    this.updateState({
      scheduleError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      scheduleSuccess: false,
      scheduledReservationResponse: null,
    });
  }

  /**
   * Finalizes the schedule operation by setting the loading state to false.
   */
  private finalizeScheduleOperation(): void {
    this.updateState({
      isScheduling: false,
    });
    Logger.debug('Schedule reservation operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetScheduleOperationState(): void {
    this._scheduleReservationState.set({
      isScheduling: false,
      scheduleSuccess: false,
      scheduleError: null,
      scheduledReservationResponse: null,
    });
    Logger.debug('Schedule reservation operation state manually reset.');
  }
}
