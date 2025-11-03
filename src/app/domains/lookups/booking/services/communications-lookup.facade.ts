import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { initialCommunicationsLookupState, CommunicationsLookupState } from '../models';
import { BookingApiClientProvider, IBookingApiClient } from '../clients';
import { ApiError, handleApiErrors, Logger } from '../../../../common';
import { LocalizationService, ToastService } from '../../../../shared';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { ICommunicationsResponseDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: IBookingApiClient = inject(BookingApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature States (Signals) ---
  private readonly _CommunicationsState: WritableSignal<CommunicationsLookupState> = signal<CommunicationsLookupState>(initialCommunicationsLookupState);

  // --- Selectors (Computed Signals) ---
  readonly Communications: Signal<ICommunicationsResponseDto | null> = computed(() => this._CommunicationsState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._CommunicationsState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._CommunicationsState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._CommunicationsState().errorMessage);

  constructor() {
    // You could optionally fetch Communications here on facade creation if they are always needed.
    // E.g., this.fetchCommunications();
  }

  /**
   * Fetches the list of Communications from the API.
   */
  public fetchCommunications(): void {
    Logger.debug('CommunicationsLookupFacade: Fetching Communications...');
    this._updateCommunicationsState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.getCommunications().pipe(
      tap((response: ICommunicationsResponseDto) => { // Assuming ICommunicationsResponseDto directly from getCommunications
        if (response.status) {
          this._updateCommunicationsState({
            response: response, // Store the entire response DTO
            status: true
          });
          Logger.debug('CommunicationsLookupFacade: Communications fetched successfully.', response.data);
          // Optionally show a toast on success, or let consumer handle
          // this._toastService.success(response.message || this._localizationService.translateTextFromJson('lookups.Communications.success'));
        } else {
          this._updateCommunicationsState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.Communications.errorLoading')
          });
          Logger.error('CommunicationsLookupFacade: Failed to fetch Communications - API status false.', response.message);
          // this._toastService.error(response.message || this._localizationService.translateTextFromJson('lookups.Communications.errorLoading'));
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateCommunicationsState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('CommunicationsLookupFacade: Error fetching Communications:', error);
        handleApiErrors(error); // Log/handle API specific errors
        // this._toastService.error(localizedError);
        return EMPTY; // Return EMPTY to complete the observable stream on error
      }),
      finalize(() => {
        this._updateCommunicationsState({ isLoading: false });
        Logger.debug('CommunicationsLookupFacade: Fetch Communications request finalized.');
      })
    ).subscribe(); // Subscribe to trigger the API call
  }

  /**
   * Resets the state of the Communications lookup.
   */
  public resetState(): void {
    this._CommunicationsState.set(initialCommunicationsLookupState);
    Logger.debug('CommunicationsLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the Communications state signal.
   * @param updates Partial updates to apply to the state.
   */
  private _updateCommunicationsState(updates: Partial<CommunicationsLookupState>): void {
    this._CommunicationsState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
