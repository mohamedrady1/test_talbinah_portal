import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { initialDurationsLookupState, DurationsLookupState } from '../models';
import { BookingApiClientProvider, IBookingApiClient } from '../clients';
import { ApiError, handleApiErrors, Logger } from '../../../../common';
import { LocalizationService, ToastService } from '../../../../shared';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IDurationsResponseDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class DurationsLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: IBookingApiClient = inject(BookingApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature States (Signals) ---
  private readonly _DurationsState: WritableSignal<DurationsLookupState> = signal<DurationsLookupState>(initialDurationsLookupState);

  // --- Selectors (Computed Signals) ---
  readonly Durations: Signal<IDurationsResponseDto | null> = computed(() => this._DurationsState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._DurationsState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._DurationsState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._DurationsState().errorMessage);

  constructor() {
    // You could optionally fetch Durations here on facade creation if they are always needed.
    // E.g., this.fetchDurations();
  }

  public fetchDurations(doctor_id?: number, params?: any): void {
    Logger.debug('DurationsLookupFacade: Fetching Durations...');
    this._updateDurationsState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.getDurations(doctor_id, params).pipe(
      tap((response: IDurationsResponseDto) => { // Assuming IDurationsResponseDto directly from getDurations
        if (response.status) {
          this._updateDurationsState({
            response: response, // Store the entire response DTO
            status: true
          });
          Logger.debug('DurationsLookupFacade: Durations fetched successfully.', response.data);
          // Optionally show a toast on success, or let consumer handle
          // this._toastService.success(response.message || this._localizationService.translateTextFromJson('lookups.Durations.success'));
        } else {
          this._updateDurationsState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.Durations.errorLoading')
          });
          Logger.error('DurationsLookupFacade: Failed to fetch Durations - API status false.', response.message);
          // this._toastService.error(response.message || this._localizationService.translateTextFromJson('lookups.Durations.errorLoading'));
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateDurationsState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('DurationsLookupFacade: Error fetching Durations:', error);
        handleApiErrors(error); // Log/handle API specific errors
        // this._toastService.error(localizedError);
        return EMPTY; // Return EMPTY to complete the observable stream on error
      }),
      finalize(() => {
        this._updateDurationsState({ isLoading: false });
        Logger.debug('DurationsLookupFacade: Fetch Durations request finalized.');
      })
    ).subscribe(); // Subscribe to trigger the API call
  }

  public resetState(): void {
    this._DurationsState.set(initialDurationsLookupState);
    Logger.debug('DurationsLookupFacade: State reset.');
  }

  private _updateDurationsState(updates: Partial<DurationsLookupState>): void {
    this._DurationsState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
