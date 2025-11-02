import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { initialCountriesLookupState, CountriesLookupState } from '../models';
import { ApiError, handleApiErrors, Logger } from '../../../../common';
import { LocalizationService, ToastService } from '../../../../shared';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';
import { ICountriesResponseDto } from '../dtos';
import { LocationsApiClientProvider } from '../clients';

@Injectable({
  providedIn: 'root'
})
export class CountriesLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient = inject(LocationsApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature States (Signals) ---
  private readonly _CountriesState: WritableSignal<CountriesLookupState> = signal<CountriesLookupState>(initialCountriesLookupState);

  // --- Selectors (Computed Signals) ---
  readonly Countries: Signal<ICountriesResponseDto | null> = computed(() => this._CountriesState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._CountriesState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._CountriesState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._CountriesState().errorMessage);

  constructor() {
    // You could optionally fetch Countries here on facade creation if they are always needed.
    // E.g., this.fetchCountries();
  }

  /**
   * Fetches the list of Countries from the API.
   */
  public fetchCountries(): void {
    Logger.debug('CountriesLookupFacade: Fetching Countries...');
    this._updateCountriesState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.getCountries().pipe(
      tap((response: ICountriesResponseDto) => { // Assuming ICountriesResponseDto directly from getCountries
        if (response.status) {
          this._updateCountriesState({
            response: response, // Store the entire response DTO
            status: true
          });
          Logger.debug('CountriesLookupFacade: Countries fetched successfully.', response.data);
          // Optionally show a toast on success, or let consumer handle
          // this._toastService.success(response.message || this._localizationService.translateTextFromJson('lookups.Countries.success'));
        } else {
          this._updateCountriesState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.Countries.errorLoading')
          });
          Logger.error('CountriesLookupFacade: Failed to fetch Countries - API status false.', response.message);
          // this._toastService.error(response.message || this._localizationService.translateTextFromJson('lookups.Countries.errorLoading'));
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('general.errorOccurred');
        this._updateCountriesState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('CountriesLookupFacade: Error fetching Countries:', error);
        handleApiErrors(error); // Log/handle API specific errors
        // this._toastService.error(localizedError);
        return EMPTY; // Return EMPTY to complete the observable stream on error
      }),
      finalize(() => {
        this._updateCountriesState({ isLoading: false });
        Logger.debug('CountriesLookupFacade: Fetch Countries request finalized.');
      })
    ).subscribe(); // Subscribe to trigger the API call
  }

  /**
   * Resets the state of the Countries lookup.
   */
  public resetState(): void {
    this._CountriesState.set(initialCountriesLookupState);
    Logger.debug('CountriesLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the Countries state signal.
   * @param updates Partial updates to apply to the state.
   */
  private _updateCountriesState(updates: Partial<CountriesLookupState>): void {
    this._CountriesState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
