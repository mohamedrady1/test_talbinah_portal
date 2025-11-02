import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';
import { ICalcReservationCancelPriceData, ICalcReservationCancelPriceResponseDto } from '../dtos';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';

export interface ICalcReservationCancelPriceState {
  isCalculating: boolean;
  calcSuccess: boolean;
  calcError: string | null;
  calculationResponse: ICalcReservationCancelPriceData | null; // Stores the 'data' part of the response
}

export const initialCalcReservationCancelPriceState: ICalcReservationCancelPriceState = {
  isCalculating: false,
  calcSuccess: false,
  calcError: null,
  calculationResponse: null,
};

// Define a unique state key for Angular's TransferState for SSR hydration
const CALC_RESERVATION_CANCEL_PRICE_STATE_KEY = makeStateKey<ICalcReservationCancelPriceState>('calcReservationCancelPriceState');

@Injectable({
  providedIn: 'root',
})
export class CalcReservationCancelPriceFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _calcReservationCancelPriceState = signal<ICalcReservationCancelPriceState>(initialCalcReservationCancelPriceState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isCalculating = computed(() => this._calcReservationCancelPriceState().isCalculating);
  readonly calcSuccess = computed(() => this._calcReservationCancelPriceState().calcSuccess);
  readonly calcError = computed(() => this._calcReservationCancelPriceState().calcError);
  readonly calculationResult = computed(() => this._calcReservationCancelPriceState().calculationResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CALC_RESERVATION_CANCEL_PRICE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating calculation price state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CALC_RESERVATION_CANCEL_PRICE_STATE_KEY); // Remove after hydration
      // }
    }
  }

  // --- Public Action Methods ---
  calcPrice(id: number): void {
    Logger.debug(`Attempting to calculate cancellation price for reservation ID: ${id}`);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isCalculating: true,
      calcSuccess: false,
      calcError: null,
      calculationResponse: null,
    });

    this._apiClient.CalcReservationCancelPrice(id)
      .pipe(
        tap((response: ICalcReservationCancelPriceResponseDto) => {
          if (response.status) {
            // Update state with successful response data
            this.updateState({
              calcSuccess: true,
              calculationResponse: response.data || null, // Store the 'data' part, or null
              calcError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CALC_RESERVATION_CANCEL_PRICE_STATE_KEY, this._calcReservationCancelPriceState());
              Logger.debug('Stored calculation price state in TransferState for SSR.');
            }
            // this._toastService.success(response.message || this._localizationService.translateTextFromJson('appointments.calcPriceSuccess'));
            Logger.debug(`Cancellation price for reservation ${id} calculated successfully:`, response.data);
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('appointments.calcPriceFailedGeneric');
            this.updateState({
              calcSuccess: false,
              calculationResponse: response.data || null,
              calcError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, error?.message ?? 'general.errorCalculatingPrice');
          Logger.debug('Error calculating cancellation price:', error);
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeCalcOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire calculation price state to its initial values.
   */
  resetState(): void {
    this._calcReservationCancelPriceState.set(initialCalcReservationCancelPriceState);
    Logger.debug('Calculation price state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<ICalcReservationCancelPriceState>): void {
    this._calcReservationCancelPriceState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error calculating cancellation price:`, error);
    handleApiErrors(error); // Call your common error handler
    // this._toastService.error(error?.message ?? this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      calcError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      calcSuccess: false,
      calculationResponse: null,
    });
  }

  /**
   * Finalizes the calculation operation by setting the loading state to false.
   */
  private finalizeCalcOperation(): void {
    this.updateState({
      isCalculating: false,
    });
    Logger.debug('Calculation price operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetCalcOperationState(): void {
    this._calcReservationCancelPriceState.set({
      isCalculating: false,
      calcSuccess: false,
      calcError: null,
      calculationResponse: null,
    });
    Logger.debug('Calculation price operation state manually reset.');
  }
}
