import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { ToastService, LocalizationService } from '../../../shared';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IKhawiikVoiceTypesDataDto } from '../dtos';

// --- State Models ---
export interface VoicesLookupState {
  response: IApiResponse<IKhawiikVoiceTypesDataDto> | null;
  isLoading: boolean;
  status: boolean | null;
  errorMessage: string | null;
}

export const initialVoicesLookupState: VoicesLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};

@Injectable({
  providedIn: 'root'
})
export class VoicesLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature State (Signal) ---
  private readonly _voicesState: WritableSignal<VoicesLookupState> = signal<VoicesLookupState>(initialVoicesLookupState);

  // --- Selectors (Computed Signals) ---
  readonly voices: Signal<IApiResponse<IKhawiikVoiceTypesDataDto> | null> = computed(() => this._voicesState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._voicesState().isLoading);
  readonly status: Signal<boolean | null> = computed(() => this._voicesState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._voicesState().errorMessage);

  constructor() { }

  /**
   * Fetches the list of voices from the API.
   */
  public fetchVoices(): void {
    Logger.debug('VoicesLookupFacade: Fetching voices...');
    this._updateVoicesState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.khawiikVoiceTypes().pipe(
      tap((response: IApiResponse<IKhawiikVoiceTypesDataDto>) => {
        if (response.status) {
          this._updateVoicesState({
            response,
            status: true,
          });
          Logger.debug('VoicesLookupFacade: Voices fetched successfully.', response.data?.voices);
        } else {
          this._updateVoicesState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('lookups.voices.errorLoading')
          });
          Logger.error('VoicesLookupFacade: Failed to fetch voices - API status false.', response.message);
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('general.errorOccurred');
        this._updateVoicesState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('VoicesLookupFacade: Error fetching voices:', error);
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateVoicesState({ isLoading: false });
        Logger.debug('VoicesLookupFacade: Fetch voices request finalized.');
      })
    ).subscribe();
  }

  /**
   * Resets the state of the voices lookup.
   */
  public resetState(): void {
    this._voicesState.set(initialVoicesLookupState);
    Logger.debug('VoicesLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the voices state signal.
   */
  private _updateVoicesState(updates: Partial<VoicesLookupState>): void {
    this._voicesState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
