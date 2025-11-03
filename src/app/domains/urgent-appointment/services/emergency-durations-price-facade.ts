import { initialEmergencyDurationsPriceLookupState, EmergencyDurationsPriceLookupState } from '../models';
import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';
import { IEmergencyDurationsPriceRequestParamsDto, IEmergencyDurationsPriceResponseDto } from '../dtos';
import { LocalizationService, ToastService } from '../../../shared';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { IUrgentAppointmentApiClient, UrgentAppointmentApiClientProvider } from '../clients';

@Injectable({
  providedIn: 'root'
})
export class EmergencyDurationsPriceLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: IUrgentAppointmentApiClient = inject(UrgentAppointmentApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature States (Signals) ---
  private readonly _EmergencyDurationsPriceState: WritableSignal<EmergencyDurationsPriceLookupState> = signal<EmergencyDurationsPriceLookupState>(initialEmergencyDurationsPriceLookupState);

  // --- Selectors (Computed Signals) ---
  readonly EmergencyDurationsPrice: Signal<IEmergencyDurationsPriceResponseDto | null> = computed(() => this._EmergencyDurationsPriceState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._EmergencyDurationsPriceState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._EmergencyDurationsPriceState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._EmergencyDurationsPriceState().errorMessage);

  constructor() {
    // You could optionally fetch EmergencyDurationsPrice here on facade creation if they are always needed.
    // E.g., this.fetchEmergencyDurationsPrice();
  }

  /**
   * Fetches the list of EmergencyDurationsPrice from the API.
   */
  public fetchEmergencyDurationsPrice(params: IEmergencyDurationsPriceRequestParamsDto): void {
    Logger.debug('EmergencyDurationsPriceLookupFacade: Fetching EmergencyDurationsPrice...');
    this._updateEmergencyDurationsPriceState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.getEmergencyDurationsPrice(params).pipe(
      tap((response: IEmergencyDurationsPriceResponseDto) => { // Assuming IEmergencyDurationsPriceResponseDto directly from getEmergencyDurationsPrice
        if (response.status) {
          this._updateEmergencyDurationsPriceState({
            response: response, // Store the entire response DTO
            status: true
          });
          Logger.debug('EmergencyDurationsPriceLookupFacade: EmergencyDurationsPrice fetched successfully.', response.data);
          // Optionally show a toast on success, or let consumer handle
          // this._toastService.success(response.message || this._localizationService.translateTextFromJson('lookups.EmergencyDurationsPrice.success'));
        } else {
          this._updateEmergencyDurationsPriceState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.EmergencyDurationsPrice.errorLoading')
          });
          Logger.error('EmergencyDurationsPriceLookupFacade: Failed to fetch EmergencyDurationsPrice - API status false.', response.message);
          // this._toastService.error(response.message || this._localizationService.translateTextFromJson('lookups.EmergencyDurationsPrice.errorLoading'));
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateEmergencyDurationsPriceState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('EmergencyDurationsPriceLookupFacade: Error fetching EmergencyDurationsPrice:', error);
        handleApiErrors(error); // Log/handle API specific errors
        // this._toastService.error(localizedError);
        return EMPTY; // Return EMPTY to complete the observable stream on error
      }),
      finalize(() => {
        this._updateEmergencyDurationsPriceState({ isLoading: false });
        Logger.debug('EmergencyDurationsPriceLookupFacade: Fetch EmergencyDurationsPrice request finalized.');
      })
    ).subscribe(); // Subscribe to trigger the API call
  }

  /**
   * Resets the state of the EmergencyDurationsPrice lookup.
   */
  public resetState(): void {
    this._EmergencyDurationsPriceState.set(initialEmergencyDurationsPriceLookupState);
    Logger.debug('EmergencyDurationsPriceLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the EmergencyDurationsPrice state signal.
   * @param updates Partial updates to apply to the state.
   */
  private _updateEmergencyDurationsPriceState(updates: Partial<EmergencyDurationsPriceLookupState>): void {
    this._EmergencyDurationsPriceState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
