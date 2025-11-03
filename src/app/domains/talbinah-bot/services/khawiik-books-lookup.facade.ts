import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ITalbinahBotApiClient, TalbinahBotApiClientProvider } from '../clients';
import { ToastService, LocalizationService } from '../../../shared';
import { catchError, EMPTY, finalize, tap, Observable, BehaviorSubject } from 'rxjs';
import { IKhawiikBooksDataDto, IStartMissionDataDto, IKhawiikBook, IVoiceTrackDataDto } from '../dtos';
import { IStartMissionRequestDto, IVoiceTrackRequestDto } from '../dtos/requests/chat-requests.dto';

// --- State Models ---
export interface KhawiikBooksLookupState {
  response: IApiResponse<IKhawiikBooksDataDto> | null;
  isLoading: boolean;
  isStartingMission: boolean;
  isTrackingVoice: boolean;
  status: boolean | null;
  errorMessage: string | null;
}

export const initialKhawiikBooksLookupState: KhawiikBooksLookupState = {
  response: null,
  isLoading: false,
  isStartingMission: false,
  isTrackingVoice: false,
  status: null,
  errorMessage: null,
};

@Injectable({
  providedIn: 'root'
})
export class KhawiikBooksLookupFacade {
  // --- Dependencies ---
  private readonly _apiClient: ITalbinahBotApiClient = inject(TalbinahBotApiClientProvider).getClient();
  private readonly _toastService: ToastService = inject(ToastService);
  private readonly _localizationService: LocalizationService = inject(LocalizationService);

  // --- Feature State (Signal) ---
  private readonly _KhawiikBooksState: WritableSignal<KhawiikBooksLookupState> = signal<KhawiikBooksLookupState>(initialKhawiikBooksLookupState);

  // --- BehaviorSubject for Current Card ---
  private readonly _currentCardSubject = new BehaviorSubject<IKhawiikBook | null>(null);

  // --- Selectors (Computed Signals) ---
  readonly khawiikBooks: Signal<IApiResponse<IKhawiikBooksDataDto> | null> = computed(() => this._KhawiikBooksState().response);
  readonly isLoading: Signal<boolean> = computed(() => this._KhawiikBooksState().isLoading);
  readonly isStartingMission: Signal<boolean> = computed(() => this._KhawiikBooksState().isStartingMission);
  readonly isTrackingVoice: Signal<boolean> = computed(() => this._KhawiikBooksState().isTrackingVoice);
  readonly status: Signal<boolean | null> = computed(() => this._KhawiikBooksState().status);
  readonly errorMessage: Signal<string | null> = computed(() => this._KhawiikBooksState().errorMessage);

  // --- Current Card Observable ---
  readonly currentCard$ = this._currentCardSubject.asObservable();

  /**
   * Get the current card value synchronously
   */
  public getCurrentCard(): IKhawiikBook | null {
    return this._currentCardSubject.value;
  }

  constructor() { }

  /**
   * Fetches the list of khawiikBooks from the API.
   */
  public fetchKhawiikBooks(): void {
    Logger.debug('KhawiikBooksLookupFacade: Fetching khawiikBooks...');
    this._updateKhawiikBooksState({ isLoading: true, errorMessage: null, status: null });

    this._apiClient.khawiikBooks().pipe(
      tap((response: IApiResponse<IKhawiikBooksDataDto>) => {
        if (response.status && response.data?.items) {
          this._updateKhawiikBooksState({
            response,
            status: true,
          });
          Logger.debug(
            'KhawiikBooksLookupFacade: khawiikBooks fetched successfully.',
            response.data.items.map(b => ({ id: b.id, slug: b.slug, status: b.user_status }))
          );
        } else {
          this._updateKhawiikBooksState({
            status: false,
            errorMessage:
              response.message ||
              this._localizationService.translateTextFromJson('lookups.khawiik.errorLoading'),
          });
          Logger.error(
            'KhawiikBooksLookupFacade: Failed to fetch khawiikBooks - API status false.',
            response.message
          );
        }
      }),
      catchError((error: ApiError) => {
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._updateKhawiikBooksState({
          status: false,
          errorMessage: localizedError
        });
        Logger.error('KhawiikBooksLookupFacade: Error fetching khawiikBooks:', error);
        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateKhawiikBooksState({ isLoading: false });
        Logger.debug('KhawiikBooksLookupFacade: Fetch khawiikBooks request finalized.');
      })
    ).subscribe();
  }

  /**
   * Starts a mission for the given mission slug.
   */
  public startMission(missionSlug: string): Observable<IApiResponse<IStartMissionDataDto>> {
    Logger.debug('KhawiikBooksLookupFacade: Starting mission...', { missionSlug });
    this._updateKhawiikBooksState({ isStartingMission: true });

    const request: IStartMissionRequestDto = { start: 1 };

    return this._apiClient.startMission(missionSlug, request).pipe(
      tap((response: IApiResponse<IStartMissionDataDto>) => {
        if (response.status && response.data) {
          Logger.debug('KhawiikBooksLookupFacade: Mission started successfully', response.data);
        } else {
          Logger.error('KhawiikBooksLookupFacade: Failed to start mission - API status false', response.message);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: response.message || this._localizationService.translateTextFromJson('khawiik.mission.startFailed'),
            life: 5000
          });
        }
      }),
      catchError((error: ApiError) => {
        Logger.error('KhawiikBooksLookupFacade: Error starting mission:', error);

        // Show error toast with the error message
        const errorMessage = error.message || this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
          detail: errorMessage,
          life: 5000
        });

        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateKhawiikBooksState({ isStartingMission: false });
      })
    );
  }

  /**
   * Sets the current card for voice tracking.
   */
  public setCurrentCard(card: IKhawiikBook | null): void {
    this._currentCardSubject.next(card);
    Logger.debug('KhawiikBooksLookupFacade: Current card set:', card?.slug);
  }

  /**
   * Tracks voice duration for the current mission.
   */
  public trackVoiceDuration(seconds: number): Observable<IApiResponse<IVoiceTrackDataDto>> {
    const currentCard = this._currentCardSubject.value;
    if (!currentCard) {
      Logger.warn('KhawiikBooksLookupFacade: No current card set for voice tracking');
      return EMPTY;
    }

    Logger.debug('KhawiikBooksLookupFacade: Tracking voice duration...', { seconds, missionSlug: currentCard.slug });
    this._updateKhawiikBooksState({ isTrackingVoice: true });

    const request: IVoiceTrackRequestDto = {
      seconds,
      mission_slug: currentCard.slug
    };

    return this._apiClient.voiceTrack(request).pipe(
      tap((response: IApiResponse<IVoiceTrackDataDto>) => {
        if (response.status && response.data) {
          Logger.debug('KhawiikBooksLookupFacade: Voice duration tracked successfully', response.data);
        } else {
          Logger.error('KhawiikBooksLookupFacade: Failed to track voice duration - API status false', response.message);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: response.message || this._localizationService.translateTextFromJson('khawiik.voice.trackFailed'),
            life: 5000
          });
        }
      }),
      catchError((error: ApiError) => {
        Logger.error('KhawiikBooksLookupFacade: Error tracking voice duration:', error);

        const errorMessage = error.message || this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
          detail: errorMessage,
          life: 5000
        });

        handleApiErrors(error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateKhawiikBooksState({ isTrackingVoice: false });
      })
    );
  }

  /**
   * Resets the state of the khawiikBooks lookup.
   */
  public resetState(): void {
    this._KhawiikBooksState.set(initialKhawiikBooksLookupState);
    this._currentCardSubject.next(null);
    Logger.debug('KhawiikBooksLookupFacade: State reset.');
  }

  /**
   * Internal helper to update the khawiikBooks state signal.
   */
  private _updateKhawiikBooksState(updates: Partial<KhawiikBooksLookupState>): void {
    this._KhawiikBooksState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
