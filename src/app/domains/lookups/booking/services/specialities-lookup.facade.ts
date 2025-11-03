import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { initialSpecialitiesLookupState, SpecialitiesLookupState } from '../models';
import { ApiError, handleApiErrors, Logger } from '../../../../common';
import { LocalizationService, ToastService } from '../../../../shared';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';
import { BookingApiClient } from '../clients/booking-api.client';
import { ISpecialitiesResponseDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class SpecialitiesLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: BookingApiClient = inject(BookingApiClient);
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature States (Signals) ---
  private readonly _specialitiesState: WritableSignal<SpecialitiesLookupState> = signal<SpecialitiesLookupState>(initialSpecialitiesLookupState);

  // --- Selectors (Computed Signals) ---
  readonly specialities: Signal<ISpecialitiesResponseDto | null> = computed(() => this._specialitiesState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._specialitiesState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._specialitiesState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._specialitiesState().errorMessage);

  constructor() {
    // You could optionally fetch specialities here on facade creation if they are always needed.
    // E.g., this.fetchSpecialities();
  }

  /**
   * Fetches the list of specialities from the API.
   */
  public fetchSpecialities(): void {
    Logger.debug('SpecialitiesLookupFacade: Fetching specialities...');
    this._updateSpecialitiesState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.getSpecialities().pipe(
      tap((response: ISpecialitiesResponseDto) => { // Assuming ISpecialitiesResponseDto directly from getSpecialities
        if (response.status) {
          this._updateSpecialitiesState({
            response: response, // Store the entire response DTO
            status: true
          });
          Logger.debug('SpecialitiesLookupFacade: Specialities fetched successfully.', response.data);
          // Optionally show a toast on success, or let consumer handle
          // this._toastService.success(response.message || this._localizationService.translateTextFromJson('lookups.specialities.success'));
        } else {
          this._updateSpecialitiesState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.specialities.errorLoading')
          });
          Logger.error('SpecialitiesLookupFacade: Failed to fetch specialities - API status false.', response.message);
          // this._toastService.error(response.message || this._localizationService.translateTextFromJson('lookups.specialities.errorLoading'));
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateSpecialitiesState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('SpecialitiesLookupFacade: Error fetching specialities:', error);
        handleApiErrors(error); // Log/handle API specific errors
        // this._toastService.error(localizedError);
        return EMPTY; // Return EMPTY to complete the observable stream on error
      }),
      finalize(() => {
        this._updateSpecialitiesState({ isLoading: false });
        Logger.debug('SpecialitiesLookupFacade: Fetch specialities request finalized.');
      })
    ).subscribe(); // Subscribe to trigger the API call
  }

  /**
   * Resets the state of the specialities lookup.
   */
  public resetState(): void {
    this._specialitiesState.set(initialSpecialitiesLookupState);
    Logger.debug('SpecialitiesLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the specialities state signal.
   * @param updates Partial updates to apply to the state.
   */
  private _updateSpecialitiesState(updates: Partial<SpecialitiesLookupState>): void {
    this._specialitiesState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
