import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';

import { UrgentAppointmentApiClient } from '../clients/urgent-appointment-api.client'; // Adjust path
import {
  ICancelEmergencyAppointmentRequestDto,
  ICancelEmergencyAppointmentResponseDto
} from '../dtos'; // Adjust path to your DTOs
import { ICancelEmergencyAppointmentState, initialCancelEmergencyAppointmentState } from '../models';

// Define a unique state key for Angular's TransferState for SSR hydration
const CANCEL_EMERGENCY_APPOINTMENT_STORE_STATE_KEY = makeStateKey<ICancelEmergencyAppointmentState>('CancelEmergencyAppointmentState');

@Injectable({
  providedIn: 'root',
})
export class CancelEmergencyAppointmentFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: UrgentAppointmentApiClient = inject(UrgentAppointmentApiClient);
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _cancelEmergencyAppointmentState = signal<ICancelEmergencyAppointmentState>(initialCancelEmergencyAppointmentState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isCancelling = computed(() => this._cancelEmergencyAppointmentState().isCancelling);
  readonly cancelSuccess = computed(() => this._cancelEmergencyAppointmentState().cancelSuccess);
  readonly cancelError = computed(() => this._cancelEmergencyAppointmentState().cancelError);
  readonly cancelledAppointmentResponse = computed(() => this._cancelEmergencyAppointmentState().cancelledAppointmentResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CANCEL_EMERGENCY_APPOINTMENT_STORE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating CancelEmergencyAppointment store state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CANCEL_EMERGENCY_APPOINTMENT_STORE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---
  /**
   * Initiates the cancellation of an emergency appointment.
   * Updates state to reflect loading, success, or error.
   * @param payload The request payload for cancellation, containing the appointment ID.
   */
  cancelEmergencyAppointment(payload: ICancelEmergencyAppointmentRequestDto, id: number): void {
    Logger.debug('Attempting to cancel EmergencyAppointment with payload:', payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isCancelling: true,
      cancelSuccess: false,
      cancelError: null,
      cancelledAppointmentResponse: null,
    });

    this._apiClient.cancelEmergencyAppointment(payload, id)
      .pipe(
        tap((response: ICancelEmergencyAppointmentResponseDto) => {
          if (response.status) {
            // Update state with successful response data
            this.updateState({
              cancelSuccess: true,
              cancelledAppointmentResponse: response.data ?? null, // Store the 'data' part
              cancelError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CANCEL_EMERGENCY_APPOINTMENT_STORE_STATE_KEY, this._cancelEmergencyAppointmentState());
              Logger.debug('Stored CancelEmergencyAppointment state in TransferState for SSR.');
            }
            // Uncomment to display a success toast notification
            // this._toastService.success(response.message || this._localizationService.translateTextFromJson('EmergencyAppointments.cancelSuccess'));
            Logger.debug('EmergencyAppointment cancelled successfully:', response.data);
          } else {
            // Handle API-level business logic errors (e.g., appointment not found, already cancelled)
            const errorMessage = response.message || this._localizationService.translateTextFromJson('EmergencyAppointments.cancelFailedGeneric');
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'general.errorCancelEmergencyAppointment');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeCancellationOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire facade state to its initial default values.
   * Useful for clearing previous operation results or errors.
   */
  resetState(): void {
    this._cancelEmergencyAppointmentState.set(initialCancelEmergencyAppointmentState);
    Logger.debug('CancelEmergencyAppointment store state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---

  /**
   * Utility method to update the internal signal state immutably.
   * @param updates A partial object containing the properties to update.
   */
  private updateState(updates: Partial<ICancelEmergencyAppointmentState>): void {
    this._cancelEmergencyAppointmentState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during the EmergencyAppointment cancellation process.
   * Logs the error, triggers global error handling, updates the state,
   * and displays a translated error toast.
   * @param error The API error object.
   * @param translationKey The translation key for the error message.
   */
  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error cancelling EmergencyAppointment:`, error);
    handleApiErrors(error); // Call your common error handler
    const translatedMessage = this._localizationService.translateTextFromJson(translationKey);
    // this._toastService.error(translatedMessage); // Display an error toast notification
    this.updateState({
      cancelError: translatedMessage,
      cancelSuccess: false,
      cancelledAppointmentResponse: null,
    });
  }

  /**
   * Finalizes the cancellation operation by setting the loading state to false.
   */
  private finalizeCancellationOperation(): void {
    this.updateState({
      isCancelling: false,
    });
    Logger.debug('CancelEmergencyAppointment operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetCancelOperationState(): void {
    this._cancelEmergencyAppointmentState.set({
      isCancelling: false,
      cancelSuccess: false,
      cancelError: null,
      cancelledAppointmentResponse: null,
    });
    Logger.debug('CancelEmergencyAppointment operation state manually reset.');
  }
}
