import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared'; // Adjust paths as necessary
import { ICancelReservationRequestDto, ICancelReservationResponseDto } from '../dtos';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { ReservationsListFacade } from './reservations-list.facade';


export interface ICancelReservationState {
  isCancelling: boolean;
  cancelSuccess: boolean;
  cancelError: string | null;
  cancelledReservationResponse: ICancelReservationResponseDto['data'] | null; // Stores the 'data' part of the response
}

/**
 * @constant initialCancelReservationState
 * @description Initial state for the reservation cancellation process.
 */
export const initialCancelReservationState: ICancelReservationState = {
  isCancelling: false,
  cancelSuccess: false,
  cancelError: null,
  cancelledReservationResponse: null,
};

// Define a unique state key for Angular's TransferState for SSR hydration
const CANCEL_RESERVATION_STATE_KEY = makeStateKey<ICancelReservationState>('cancelReservationState');

@Injectable({
  providedIn: 'root',
})
export class CancelReservationFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private readonly _reservationsListFacade = inject(ReservationsListFacade);

  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _cancelReservationState = signal<ICancelReservationState>(initialCancelReservationState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isCancelling = computed(() => this._cancelReservationState().isCancelling);
  readonly cancelSuccess = computed(() => this._cancelReservationState().cancelSuccess);
  readonly cancelError = computed(() => this._cancelReservationState().cancelError);
  readonly cancelledReservation = computed(() => this._cancelReservationState().cancelledReservationResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CANCEL_RESERVATION_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating cancel reservation state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CANCEL_RESERVATION_STATE_KEY); // Remove after hydration
      // }
    }
  }

  // --- Public Action Methods ---
  cancelReservation(id: number, payload: ICancelReservationRequestDto): void {
    Logger.debug(`Attempting to cancel reservation ${id} with payload:`, payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isCancelling: true,
      cancelSuccess: false,
      cancelError: null,
      cancelledReservationResponse: null,
    });

    this._apiClient.CancelReservationById(id, payload)
      .pipe(
        tap((response: ICancelReservationResponseDto) => {
          if (response.status) {
            // Update state with successful response data
            this.updateState({
              cancelSuccess: true,
              cancelledReservationResponse: response.data || null, // Store the 'data' part, or null
              cancelError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CANCEL_RESERVATION_STATE_KEY, this._cancelReservationState());
              Logger.debug('Stored cancel reservation state in TransferState for SSR.');
            }
            // this._toastService.success(response.message || this._localizationService.translateTextFromJson('appointments.cancelSuccess'));
            Logger.debug(`Reservation ${id} cancelled successfully:`, response.data);
            this._reservationsListFacade.getTodayCurrentAppointments();
            this._reservationsListFacade.resetFilters();

          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('appointments.cancelFailedGeneric');
            this.updateState({
              cancelSuccess: false,
              cancelledReservationResponse: response.data || null,
              cancelError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'general.errorCancellingReservation');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeCancelOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire cancellation state to its initial values.
   */
  resetState(): void {
    this._cancelReservationState.set(initialCancelReservationState);
    Logger.debug('Cancel reservation state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<ICancelReservationState>): void {
    this._cancelReservationState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error cancelling reservation:`, error);
    handleApiErrors(error); // Call your common error handler
    // this._toastService.error(error?.message ?? this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      cancelError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      cancelSuccess: false,
      cancelledReservationResponse: null,
    });
  }

  /**
   * Finalizes the cancel operation by setting the loading state to false.
   */
  private finalizeCancelOperation(): void {
    this.updateState({
      isCancelling: false,
    });
    Logger.debug('Cancel reservation operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetCancelOperationState(): void {
    this._cancelReservationState.set({
      isCancelling: false,
      cancelSuccess: false,
      cancelError: null,
      cancelledReservationResponse: null,
    });
    Logger.debug('Cancel reservation operation state manually reset.');
  }
}
