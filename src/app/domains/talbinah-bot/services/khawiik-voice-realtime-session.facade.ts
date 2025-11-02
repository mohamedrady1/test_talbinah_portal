import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { IKhawiikVoiceRealtimeSessionDataDto } from '../dtos';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { LocalizationService } from '../../../shared';

// --- State Models ---
export interface VoiceRealtimeSessionState {
  response: IApiResponse<IKhawiikVoiceRealtimeSessionDataDto> | null;
  keyResponse: IKhawiikVoiceRealtimeSessionDataDto | null;
  isLoading: boolean;
  status: boolean | null;
  errorMessage: string | null;
}

export const initialVoiceRealtimeSessionState: VoiceRealtimeSessionState = {
  response: null,
  keyResponse: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};

@Injectable({
  providedIn: 'root'
})
export class KhawiikVoiceRealtimeSessionFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature State (Signal) ---
  private readonly _sessionState: WritableSignal<VoiceRealtimeSessionState> =
    signal<VoiceRealtimeSessionState>(initialVoiceRealtimeSessionState);

  // --- Base Selectors ---
  readonly session: Signal<IApiResponse<IKhawiikVoiceRealtimeSessionDataDto> | null> =
    computed(() => this._sessionState().response);

  readonly keyResponse: Signal<IKhawiikVoiceRealtimeSessionDataDto | null> =
    computed(() => this._sessionState().keyResponse);

  readonly isLoading: Signal<boolean> =
    computed(() => this._sessionState().isLoading);

  readonly status: Signal<boolean | null> =
    computed(() => this._sessionState().status);

  readonly errorMessage: Signal<string | null> =
    computed(() => this._sessionState().errorMessage);

  // --- Convenience Selectors for Data ---
  readonly sessionId: Signal<string | null> =
    computed(() => this.keyResponse()?.session_id ?? null);

  readonly ephemeralKey: Signal<string | null> =
    computed(() => this.keyResponse()?.ephemeral_key ?? null);

  readonly webrtcUrl: Signal<string | null> =
    computed(() => this.keyResponse()?.webrtc_url ?? null);

  readonly expiresAt: Signal<number | null> =
    computed(() => this.keyResponse()?.expires_at ?? null);

  readonly secondsUntilExpiry: Signal<number | null> =
    computed(() => this.keyResponse()?.seconds_until_expiry ?? null);

  readonly deployment: Signal<string | null> =
    computed(() => this.keyResponse()?.deployment ?? null);

  readonly apiVersion: Signal<string | null> =
    computed(() => this.keyResponse()?.api_version ?? null);

  readonly voice: Signal<string | null> =
    computed(() => this.keyResponse()?.voice ?? null);

  constructor() { }

  /**
   * Fetches a realtime voice session from the API.
   */
  public fetchRealtimeSession(voiceSlug?: string | null, isPreviousSessionComplete?: boolean | null): void {
    Logger.debug('KhawiikVoiceRealtimeSessionFacade: Fetching realtime voice session...', voiceSlug ? `with voice_slug: ${voiceSlug}` : '');
    this._updateSessionState({ isLoading: true, errorMessage: null, status: null });

    // Build params conditionally
    let params: { voice_slug: string; is_previous_session_complete: boolean } | undefined;

    if (voiceSlug) {
      params = {
        voice_slug: voiceSlug,
        is_previous_session_complete: isPreviousSessionComplete !== null && isPreviousSessionComplete !== undefined
          ? isPreviousSessionComplete
          : true // Default to true if not provided
      };
    } else if (isPreviousSessionComplete !== null && isPreviousSessionComplete !== undefined) {
      // If only isPreviousSessionComplete is provided without voiceSlug
      params = {
        voice_slug: '', // Or you might want to handle this differently
        is_previous_session_complete: isPreviousSessionComplete
      };
    }
    this._apiClient.khawiikVoiceRealtimeSession(params).pipe(
      tap((response: IApiResponse<IKhawiikVoiceRealtimeSessionDataDto>) => {
        if (response.status && response.data) {
          this._updateSessionState({
            response,
            keyResponse: response.data,
            status: true,
          });
          Logger.debug('KhawiikVoiceRealtimeSessionFacade: Session fetched successfully.', response.data);
        } else {
          this._updateSessionState({
            status: false,
            errorMessage: response.message || this._localizationService.translateTextFromJson('voice.session.errorLoading')
          });
          Logger.error('KhawiikVoiceRealtimeSessionFacade: Failed to fetch session - API status false.', response.message);
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('general.errorOccurred');
        this._updateSessionState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('KhawiikVoiceRealtimeSessionFacade: Error fetching session:', error);
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateSessionState({ isLoading: false });
        Logger.debug('KhawiikVoiceRealtimeSessionFacade: Fetch session request finalized.');
      })
    ).subscribe();
  }

  /**
   * Resets the realtime session state.
   */
  public resetState(): void {
    this._sessionState.set(initialVoiceRealtimeSessionState);
    Logger.debug('KhawiikVoiceRealtimeSessionFacade: State reset.');
  }

  /**
   * Internal helper to update the session state signal.
   */
  private _updateSessionState(updates: Partial<VoiceRealtimeSessionState>): void {
    this._sessionState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
