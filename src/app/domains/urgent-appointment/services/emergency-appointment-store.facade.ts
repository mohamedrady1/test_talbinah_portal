import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ModalService, ToastService } from '../../../shared';
import { initialEmergencyAppointmentStoreState, IEmergencyAppointmentStoreState } from '../models';
import { IUrgentAppointmentApiClient, UrgentAppointmentApiClientProvider } from '../clients';
import { IStoreEmergencyAppointmentRequestDto } from '../dtos';
import { IStoreEmergencyAppointmentResponseDto } from '../dtos/responses/store-emergency-appointment-response.dto';
import { WalletFacade } from '../../settings';


// Define a unique state key for Angular's TransferState for SSR hydration
const EMERGENCY_APPOINTMENT_STORE_STATE_KEY = makeStateKey<IEmergencyAppointmentStoreState>('EmergencyAppointmentStoreState');

@Injectable({
  providedIn: 'root', // This makes the facade a singleton service
})
export class EmergencyAppointmentStoreFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IUrgentAppointmentApiClient = inject(UrgentAppointmentApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private walletService = inject(WalletFacade);
  private modalService = inject(ModalService);
  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _storeEmergencyAppointmentState = signal<IEmergencyAppointmentStoreState>(initialEmergencyAppointmentStoreState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isStoringEmergencyAppointment = computed(() => this._storeEmergencyAppointmentState().isStoring);
  readonly storeSuccess = computed(() => this._storeEmergencyAppointmentState().storeSuccess);
  readonly storeError = computed(() => this._storeEmergencyAppointmentState().storeError);
  readonly storedEmergencyAppointment = computed(() => this._storeEmergencyAppointmentState().storedEmergencyAppointmentResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(EMERGENCY_APPOINTMENT_STORE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating EmergencyAppointment store state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(EMERGENCY_APPOINTMENT_STORE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---
  storeEmergencyAppointment(payload: IStoreEmergencyAppointmentRequestDto): void {
    Logger.debug('Attempting to store EmergencyAppointment with payload:', payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isStoring: true,
      storeSuccess: false,
      storeError: null,
      storedEmergencyAppointmentResponse: null,
    });

    this._apiClient.storeEmergencyAppointment(payload)
      .pipe(
        tap((response: IStoreEmergencyAppointmentResponseDto) => {
          if (response.status) {
            if (payload.payment_id === 1) {
              this.modalService.closeAll();
            }
            // Update state with successful response data
            this.updateState({
              storeSuccess: true,
              storedEmergencyAppointmentResponse: response.data, // Store the 'data' part
              storeError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(EMERGENCY_APPOINTMENT_STORE_STATE_KEY, this._storeEmergencyAppointmentState());
              Logger.debug('Stored EmergencyAppointment state in TransferState for SSR.');
            }
            // Uncomment to display a success toast notification
            // this._toastService.success(this._localizationService.translateTextFromJson('EmergencyAppointments.storeSuccess'));
            Logger.debug('EmergencyAppointment stored successfully:', response.data);
            this.walletService.fetchWallet();
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('EmergencyAppointments.storeFailedGeneric');
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'an_error_has_occurred');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeStoreOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire facade state to its initial default values.
   * Useful for clearing previous operation results or errors.
   */
  resetState(): void {
    this._storeEmergencyAppointmentState.set(initialEmergencyAppointmentStoreState);
    Logger.debug('EmergencyAppointment store state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---

  /**
   * Utility method to update the internal signal state immutably.
   * @param updates A partial object containing the properties to update.
   */
  private updateState(updates: Partial<IEmergencyAppointmentStoreState>): void {
    this._storeEmergencyAppointmentState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during the EmergencyAppointment store process.
   * Logs the error, triggers global error handling, updates the state,
   * and displays a translated error toast.
   * @param error The API error object.
   * @param translationKey The translation key for the error message.
   */
  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error storing EmergencyAppointment:`, error);
    handleApiErrors(error); // Call your common error handler
    // Uncomment to display an error toast notification
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      storeError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      storeSuccess: false,
      storedEmergencyAppointmentResponse: null,
    });
  }

  /**
   * Finalizes the store operation by setting the loading state to false.
   */
  private finalizeStoreOperation(): void {
    this.updateState({
      isStoring: false,
    });
    Logger.debug('EmergencyAppointment store operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetStoreOperationState(): void {
    this._storeEmergencyAppointmentState.set({
      isStoring: false,
      storeSuccess: false,
      storeError: null,
      storedEmergencyAppointmentResponse: null,
    });
    Logger.debug('EmergencyAppointment store operation state manually reset.');
  }
}
