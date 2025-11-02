import {
  Injectable,
  PLATFORM_ID,
  inject,
  makeStateKey,
  TransferState,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { Logger, handleApiErrors } from '../../../common';
import { ISendNotificationRequestDto, ISendNotificationResponsetDto } from '../../authentication/user-authentication/dtos';
import { UserAuthenticationApiClientProvider } from '../../authentication';

const SEND_NOTIFICATION_STATE_KEY =
  makeStateKey<ISendNotificationFeatureState>('sendNotification');

interface ISendNotificationState {
  response: ISendNotificationResponsetDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  success: boolean;
}

interface ISendNotificationFeatureState {
  state: ISendNotificationState;
}

const initialSendNotificationState: ISendNotificationFeatureState = {
  state: {
    response: null,
    isLoading: false,
    errorMessage: null,
    success: false
  }
};

@Injectable({ providedIn: 'root' })
export class SendNotificationFacade {
  private readonly _client = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<ISendNotificationFeatureState>(
    initialSendNotificationState
  );

  // === SELECTORS ===
  readonly response = computed(() => this._state().state.response);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly success = computed(() => this._state().state.success);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // If you want to restore SSR state:
      // const cached = this._transferState.get<ISendNotificationFeatureState>(
      //   SEND_NOTIFICATION_STATE_KEY,
      //   initialSendNotificationState
      // );
      // if (cached) {
      //   Logger.debug('[SendNotificationFacade] Hydrated from TransferState');
      //   this._state.set(cached);
      //   this._transferState.remove(SEND_NOTIFICATION_STATE_KEY);
      // }
    }
  }

  sendNotification(payload: ISendNotificationRequestDto): void {
    Logger.debug('[SendNotificationFacade] Sending notification...', payload);

    this._updateState({
      isLoading: true,
      errorMessage: null,
      success: false
    });

    this._client
      .SendNotification(payload)
      .pipe(
        tap((res: ISendNotificationResponsetDto) => {
          const newState: ISendNotificationState = {
            response: res,
            success: !!res?.status,
            isLoading: false,
            errorMessage: res?.status
              ? null
              : res?.message || 'تعذر إرسال الإشعار'
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(SEND_NOTIFICATION_STATE_KEY, {
              state: newState
            });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('[SendNotificationFacade] Failed to send', err);
          this._updateState({
            response: null,
            isLoading: false,
            success: false,
            errorMessage: 'حدث خطأ أثناء إرسال الإشعار'
          });
          handleApiErrors(err);
          return EMPTY;
        }),
        finalize(() => {
          this._updateState({ isLoading: false });
        })
      )
      .subscribe();
  }

  private _updateState(updates: Partial<ISendNotificationState>) {
    this._state.update((prev) => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
