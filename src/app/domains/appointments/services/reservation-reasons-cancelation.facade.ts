import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { Logger, handleApiErrors, ApiError } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import {
  ICancelationReasonItem,
  IReasonsCancelationListingResponseDto
} from '../dtos'; // Adjust paths if needed

// State Interface
export interface IReasonsCancelationState {
  isLoading: boolean;
  error: string | null;
  reasons: ICancelationReasonItem[];
}

// Initial State
const initialReasonsCancelationState: IReasonsCancelationState = {
  isLoading: false,
  error: null,
  reasons: [],
};

// TransferState Key for SSR hydration
const REASONS_CANCELATION_STATE_KEY = makeStateKey<IReasonsCancelationState>('reasonsCancelationState');

@Injectable({ providedIn: 'root' })
export class ReservationReasonsCancelationFacade {
  // --- Dependencies ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _localization = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Signal State ---
  private readonly _state = signal<IReasonsCancelationState>(initialReasonsCancelationState);

  // --- Public Selectors (computed signals) ---
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly reasons = computed(() => this._state().reasons);

  constructor() {
    // Hydrate from TransferState (SSR)
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(REASONS_CANCELATION_STATE_KEY, null);
      // if (cached) {
      //   Logger.debug('Hydrated reasons cancelation from TransferState:', cached);
      //   this._state.set(cached);
      //   this._transferState.remove(REASONS_CANCELATION_STATE_KEY);
      // }
    }
  }

  /**
   * Loads reasons for appointment cancellation.
   */
  loadReasons(): void {
    Logger.debug('Loading appointment cancellation reasons...');

    // Set loading state
    this.updateState({ isLoading: true, error: null });

    this._apiClient.ReasonsCancelation()
      .pipe(
        tap((response: IReasonsCancelationListingResponseDto) => {
          if (response.status) {
            this.updateState({
              reasons: response.data || [],
              error: null,
            });

            // Transfer SSR data
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(REASONS_CANCELATION_STATE_KEY, this._state());
              Logger.debug('Stored cancelation reasons in TransferState (SSR).');
            }

            Logger.info('Cancellation reasons loaded:', response.data);
          } else {
            const fallbackMessage = this._localization.translateTextFromJson('appointments.reasonsLoadFailed');
            this.handleError({ message: response.message || fallbackMessage } as ApiError, fallbackMessage);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'appointments.reasonsLoadFailed');
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  /**
   * Resets internal state to initial defaults.
   */
  reset(): void {
    this._state.set(initialReasonsCancelationState);
    Logger.debug('Reasons cancelation state reset.');
  }

  // --- Utility ---
  private updateState(updates: Partial<IReasonsCancelationState>): void {
    this._state.update((current) => ({ ...current, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error('Error loading cancellation reasons:', error);
    handleApiErrors(error);

    const translatedMessage = error?.message ?? this._localization.translateTextFromJson(translationKey);
    this.updateState({ error: translatedMessage });
    // this._toast.error(translatedMessage); // Uncomment for UX notification
  }
}
