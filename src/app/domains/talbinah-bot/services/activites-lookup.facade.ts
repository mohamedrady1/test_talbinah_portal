import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { Observable, catchError, EMPTY, finalize, tap } from 'rxjs';
import { ToastService, LocalizationService } from '../../../shared';
import { IKhawiikVoiceActivitiesDataDto } from '../dtos';

// --- State Models ---
export interface KhawiikActivitiesLookupState {
  response: IApiResponse<IKhawiikVoiceActivitiesDataDto> | null;
  isLoading: boolean;
  status: boolean | null;
  errorMessage: string | null;
}

export const initialKhawiikActivitiesLookupState: KhawiikActivitiesLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};

@Injectable({
  providedIn: 'root'
})
export class KhawiikActivitiesLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature State (Signal) ---
  private readonly _activitiesState: WritableSignal<KhawiikActivitiesLookupState> = signal<KhawiikActivitiesLookupState>(initialKhawiikActivitiesLookupState);

  // --- Selectors (Computed Signals) ---
  readonly activities: Signal<IApiResponse<IKhawiikVoiceActivitiesDataDto> | null> = computed(() => this._activitiesState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._activitiesState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._activitiesState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._activitiesState().errorMessage);

  constructor() { }

  /**
   * Fetches the list of activities from the API.
   */
  public fetchActivities(): void {
    Logger.debug('VoiceActivitiesLookupFacade: Fetching activities...');
    this._updateActivitiesState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.khawiikVoiceActivities().pipe(
      tap((response: IApiResponse<IKhawiikVoiceActivitiesDataDto>) => {
        if (response.status) {
          this._updateActivitiesState({
            response,
            status: true,
          });
          Logger.debug('VoiceActivitiesLookupFacade: Activities fetched successfully.', response.data?.items);
        } else {
          this._updateActivitiesState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.activities.errorLoading')
          });
          Logger.error('VoiceActivitiesLookupFacade: Failed to fetch activities - API status false.', response.message);
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateActivitiesState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('VoiceActivitiesLookupFacade: Error fetching activities:', error);
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateActivitiesState({ isLoading: false });
        Logger.debug('VoiceActivitiesLookupFacade: Fetch activities request finalized.');
      })
    ).subscribe();
  }

  /**
   * Resets the state of the activities lookup.
   */
  public resetState(): void {
    this._activitiesState.set(initialKhawiikActivitiesLookupState);
    Logger.debug('VoiceActivitiesLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the activities state signal.
   */
  private _updateActivitiesState(updates: Partial<KhawiikActivitiesLookupState>): void {
    this._activitiesState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
