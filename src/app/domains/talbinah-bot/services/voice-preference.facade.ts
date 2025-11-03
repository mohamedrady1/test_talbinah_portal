import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { ToastService, LocalizationService } from '../../../shared';
import { ISaveKhawiikVoiceTypeDataDto } from '../dtos';

// --- State Model ---
export interface VoicePreferenceState {
  response: IApiResponse<ISaveKhawiikVoiceTypeDataDto> | null;
  isSaving: boolean;
  status: boolean | null;
  errorMessage: string | null;
}

export const initialVoicePreferenceState: VoicePreferenceState = {
  response: null,
  isSaving: false,
  status: null,
  errorMessage: null,
};

@Injectable({
  providedIn: 'root',
})
export class VoicePreferenceFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature State ---
  private readonly _state: WritableSignal<VoicePreferenceState> = signal(initialVoicePreferenceState);

  // --- Reactive Streams ---
  private readonly _savedVoiceSubject = new BehaviorSubject<ISaveKhawiikVoiceTypeDataDto | null>(null);
  /** Observable stream to subscribe to when voice preference is successfully saved */
  readonly savedVoice$ = this._savedVoiceSubject.asObservable();

  // --- Selectors (Signals) ---
  readonly response: Signal<IApiResponse<ISaveKhawiikVoiceTypeDataDto> | null> = computed(() => this._state().response);
  readonly isSaving: Signal<boolean> = computed(() => this._state().isSaving);
  readonly status: Signal<boolean | null> = computed(() => this._state().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._state().errorMessage);

  constructor() { }

  /**
   * Saves a voice preference for the current user.
   */
  public saveVoice(voice: string): void {
    Logger.debug(`VoicePreferenceFacade: Saving voice "${voice}"...`);
    this._updateState({ isSaving: true, errorMessage: null, status: null });

    this._apiClient
      .saveKhawiikVoiceType({ voice })
      .pipe(
        tap((response: IApiResponse<ISaveKhawiikVoiceTypeDataDto>) => {
          if (response.status) {
            this._updateState({ response, status: true });
            Logger.debug('VoicePreferenceFacade: Voice saved successfully.', response.data);

            // ✅ Emit the saved voice preference
            this._savedVoiceSubject.next(response.data);

            // Optional success toast
            // this._toastService.add({
            //   severity: 'success',
            //   summary: this._localizationService.translateTextFromJson('general.success'),
            //   detail: this._localizationService.translateTextFromJson('voicePreference.saved'),
            //   life: 4000,
            // });
          } else {
            const errorMsg = response.message || this._localizationService.translateTextFromJson('voicePreference.error');
            this._updateState({ status: false, errorMessage: errorMsg });
            Logger.error('VoicePreferenceFacade: Failed to save voice - API status false.', errorMsg);

            this._toastService.add({
              severity: 'error',
              summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
              detail: errorMsg,
              life: 5000,
            });
          }
        }),
        catchError((error: ApiError) => {
          const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
          this._updateState({ status: false, errorMessage: localizedError });
          Logger.error('VoicePreferenceFacade: Error saving voice:', error);
          handleApiErrors(error);

          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: localizedError,
            life: 5000,
          });

          return EMPTY;
        }),
        finalize(() => {
          this._updateState({ isSaving: false });
          Logger.debug('VoicePreferenceFacade: Save voice request finalized.');
        })
      )
      .subscribe();
  }

  /**
   * Resets the state.
   */
  public resetState(): void {
    this._state.set(initialVoicePreferenceState);
    this._savedVoiceSubject.next(null);
    Logger.debug('VoicePreferenceFacade: State reset.');
  }

  /**
   * Internal helper for updating state.
   */
  private _updateState(updates: Partial<VoicePreferenceState>): void {
    this._state.update((state) => ({
      ...state,
      ...updates,
    }));
  }
}
