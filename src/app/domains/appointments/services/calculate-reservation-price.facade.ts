import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common'; // Adjust common utilities path
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared'; // Adjust shared services path
import { CalculateReservationPriceState, initialCalculateReservationPriceState } from '../models';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { ICalculateReservationPriceRequestDto, ICalculateReservationPriceResponseDto } from '../dtos';


// Define a unique state key for Angular's TransferState for SSR hydration
const CALC_PRICE_STATE_KEY = makeStateKey<CalculateReservationPriceState>('calculateReservationPriceState');

@Injectable({
  providedIn: 'root', // This makes the facade a singleton service
})
export class CalculateReservationPriceFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _priceCalculationState = signal<CalculateReservationPriceState>(initialCalculateReservationPriceState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isCalculatingPrice = computed(() => this._priceCalculationState().isCalculating);
  readonly calculationSuccess = computed(() => this._priceCalculationState().calculationSuccess);
  readonly calculationError = computed(() => this._priceCalculationState().calculationError);
  readonly calculatedPriceResponse = computed(() => this._priceCalculationState().calculatedPriceResponse);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CALC_PRICE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating calculate reservation price state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CALC_PRICE_STATE_KEY); // Remove after hydration to prevent re-use
      // }
    }
  }

  // --- Public Action Methods ---
  calculateReservationPrice(payload: ICalculateReservationPriceRequestDto): void {
    Logger.debug('Attempting to calculate reservation price with payload:', payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isCalculating: true,
      calculationSuccess: false,
      calculationError: null,
      calculatedPriceResponse: null,
    });

    this._apiClient.calculateReservationPrice(payload)
      .pipe(
        tap((response: ICalculateReservationPriceResponseDto) => {
          if (response.status) { // Check the 'status' field from the API response
            // Update state with successful response data
            this.updateState({
              calculationSuccess: true,
              calculatedPriceResponse: response,
              calculationError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CALC_PRICE_STATE_KEY, this._priceCalculationState());
              Logger.debug('Stored calculate price state in TransferState for SSR.');
            }
            // Display a success toast notification
            // this._toastService.success(this._localizationService.translateTextFromJson('reservations.priceCalculationSuccess'));
            Logger.debug('Reservation price calculated successfully:', response);
          } else {
            // Handle API-level business logic errors (e.g., specific messages from backend)
            const errorMessage = response.message || this._localizationService.translateTextFromJson('reservations.priceCalculationFailedGeneric');
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, error?.message ?? 'an_error_has_occurredCalculatingPrice');
          Logger.debug('Error calculating reservation price:', error?.message);

          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state, regardless of success or error
          this.finalizeCalculation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire facade state to its initial default values.
   * Useful for clearing previous calculation results or errors before a new operation.
   */
  resetState(): void {
    this._priceCalculationState.set(initialCalculateReservationPriceState);
    Logger.debug('Calculate reservation price state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---

  /**
   * Utility method to update the internal signal state immutably.
   * @param updates A partial object containing the properties to update.
   */
  private updateState(updates: Partial<CalculateReservationPriceState>): void {
    this._priceCalculationState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during the price calculation process.
   * Logs the error, triggers global error handling, updates the state,
   * and displays a translated error toast.
   * @param error The API error object.
   * @param translationKey The translation key for the error message.
   */
  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error calculating reservation price:`, error);
    handleApiErrors(error); // Call your common error handler (e.g., for logging, analytics)
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      calculationError: this._localizationService.translateTextFromJson(translationKey),
      calculationSuccess: false,
      calculatedPriceResponse: null,
    });
  }

  /**
   * Finalizes the calculation process by setting the loading state to false.
   */
  private finalizeCalculation(): void {
    this.updateState({
      isCalculating: false,
    });
    Logger.debug('Reservation price calculation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state (e.g., if you only want to clear
   * the result of a previous calculation without affecting other parts of the state).
   */
  resetCalculationState(): void {
    this._priceCalculationState.set({
      isCalculating: false,
      calculationSuccess: false,
      calculationError: null,
      calculatedPriceResponse: null,
    });
    Logger.debug('Calculate reservation price state manually reset.');
  }
}
