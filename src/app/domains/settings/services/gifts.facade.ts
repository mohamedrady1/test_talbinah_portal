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
import { SettingsApiClientProvider } from '../clients';
import { IGiftReciverDto, IGiftReciverResponseDto, IGiftSenderDto, IGiftSenderResponseDto, IGiftSendRequestDto } from '../dtos';
import { IGiftSendResponseDto } from '../dtos/responses/gift-send-response.dto';
import { ToastService } from '../../../shared';
import { WalletFacade } from './wallet.facade';

const GIFTS_STATE_KEY = makeStateKey<GiftsFeatureState>('gifts');

interface GiftsState {
  sentGifts: IGiftSenderDto[];
  receivedGifts: IGiftReciverDto[];
}

interface GiftsFeatureState {
  state: GiftsState;
}

const initialGiftsState: GiftsFeatureState = {
  state: {
    sentGifts: [],
    receivedGifts: []
  }
};

@Injectable({ providedIn: 'root' })
export class GiftsFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<GiftsFeatureState>(initialGiftsState);

  // Sent gifts state
  private readonly _isLoadingSent = signal(false);
  private readonly _errorMessageSent = signal<string | null>(null);
  private readonly _statusSent = signal<boolean | null>(null);
  // Received gifts state
  private readonly _isLoadingReceived = signal(false);
  private readonly _errorMessageReceived = signal<string | null>(null);
  private readonly _statusReceived = signal<boolean | null>(null);
  // Send gift state
  private readonly _isLoadingSend = signal(false);
  private readonly _errorMessageSend = signal<string | null>(null);
  private readonly _statusSend = signal<boolean | null>(null);
  // Accept gift state
  private readonly _isLoadingAccept = signal(false);
  private readonly _errorMessageAccept = signal<string | null>(null);
  private readonly _statusAccept = signal<boolean | null>(null);
  private readonly _messageAccept = signal<string | null>(null);
  // Cancel gift state
  private readonly _isLoadingCancel = signal(false);
  private readonly _errorMessageCancel = signal<string | null>(null);
  private readonly _statusCancel = signal<boolean | null>(null);
  private readonly _messageCancel = signal<string | null>(null);
  private readonly toastService = inject(ToastService);

  readonly sentGifts = computed(() => this._state().state.sentGifts);
  readonly receivedGifts = computed(() => this._state().state.receivedGifts);

  // Expose signals for each operation
  readonly isLoadingSent = computed(() => this._isLoadingSent());
  readonly errorMessageSent = computed(() => this._errorMessageSent());
  readonly statusSent = computed(() => this._statusSent());

  readonly isLoadingReceived = computed(() => this._isLoadingReceived());
  readonly errorMessageReceived = computed(() => this._errorMessageReceived());
  readonly statusReceived = computed(() => this._statusReceived());

  readonly isLoadingSend = computed(() => this._isLoadingSend());
  readonly errorMessageSend = computed(() => this._errorMessageSend());
  readonly statusSend = computed(() => this._statusSend());

  readonly isLoadingAccept = computed(() => this._isLoadingAccept());
  readonly errorMessageAccept = computed(() => this._errorMessageAccept());
  readonly statusAccept = computed(() => this._statusAccept());
  readonly messageAccept = computed(() => this._messageAccept());

  readonly isLoadingCancel = computed(() => this._isLoadingCancel());
  readonly errorMessageCancel = computed(() => this._errorMessageCancel());
  readonly statusCancel = computed(() => this._statusCancel());
  readonly messageCancel = computed(() => this._messageCancel());

  private readonly _walletFacade = inject(WalletFacade);
  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<GiftsFeatureState>(GIFTS_STATE_KEY, initialGiftsState);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(GIFTS_STATE_KEY);
      // }
    }
  }

  fetchSentGifts(): void {
    this._isLoadingSent.set(true);
    this._errorMessageSent.set(null);
    this._statusSent.set(null);
    this._apiClient.getSentGifts()
      .pipe(
        tap((res: IGiftSenderResponseDto) => {
          this._state.update((prev) => ({
            state: {
              ...prev.state,
              sentGifts: res.data ?? []
            }
          }));
          this._statusSent.set(res.status);
          this._errorMessageSent.set(res.status ? null : res.message ?? 'تعذر تحميل الهدايا المرسلة');
        }),
        catchError((err) => {
          this._state.update((prev) => ({
            state: {
              ...prev.state,
              sentGifts: []
            }
          }));
          this._statusSent.set(false);
          this._errorMessageSent.set('حدث خطأ أثناء تحميل الهدايا المرسلة');
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingSent.set(false);
        })
      )
      .subscribe();
  }

  fetchReceivedGifts(): void {
    this._isLoadingReceived.set(true);
    this._errorMessageReceived.set(null);
    this._statusReceived.set(null);
    this._apiClient.getReceivedGifts()
      .pipe(
        tap((res: IGiftReciverResponseDto) => {
          this._state.update((prev) => ({
            state: {
              ...prev.state,
              receivedGifts: res.data ?? []
            }
          }));
          this._statusReceived.set(res.status);
          this._errorMessageReceived.set(res.status ? null : res.message ?? 'تعذر تحميل الهدايا المستلمة');
        }),
        catchError((err) => {
          this._state.update((prev) => ({
            state: {
              ...prev.state,
              receivedGifts: []
            }
          }));
          this._statusReceived.set(false);
          this._errorMessageReceived.set('حدث خطأ أثناء تحميل الهدايا المستلمة');
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingReceived.set(false);
        })
      )
      .subscribe();
  }

  sendGift(payload: IGiftSendRequestDto): void {
    this._isLoadingSend.set(true);
    this._errorMessageSend.set(null);
    this._statusSend.set(null);

    this._apiClient.sendGift(payload)
      .pipe(
        tap((res: IGiftSendResponseDto) => {
          this._statusSend.set(res.status);
          this._errorMessageSend.set(res.status ? null : res.message ?? 'تعذر إرسال الهدية');
          this._walletFacade.fetchWallet();
        }),
        catchError((err: any) => {
          this._statusSend.set(false);
          this._errorMessageSend.set(err.message ?? 'حدث خطأ أثناء إرسال الهدية');
          // this.toastService.add({
          //   severity: 'error',
          //   summary: 'gift_sending_error_retry',
          //   detail: '',
          // });
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingSend.set(false);
        })
      )
      .subscribe();
  }


  acceptGift(gift_id: number): void {
    this._isLoadingAccept.set(true);
    this._errorMessageAccept.set(null);
    this._statusAccept.set(null);
    this._messageAccept.set(null);
    this._apiClient.acceptGift(gift_id)
      .pipe(
        tap((res: any) => {
          this._statusAccept.set(res.status);
          this._messageAccept.set(res.message ?? null);
          this._errorMessageAccept.set(res.status ? null : res.message ?? 'تعذر قبول الهدية');
          this._walletFacade.fetchWallet();
        }),
        catchError((err) => {
          this._statusAccept.set(false);
          this._messageAccept.set(null);
          this._errorMessageAccept.set('حدث خطأ أثناء قبول الهدية');
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingAccept.set(false);
        })
      )
      .subscribe();
  }

  cancelGift(gift_id: number): void {
    this._isLoadingCancel.set(true);
    this._errorMessageCancel.set(null);
    this._statusCancel.set(null);
    this._messageCancel.set(null);
    this._apiClient.cancelGift(gift_id)
      .pipe(
        tap((res: any) => {
          this._statusCancel.set(res.status);
          this._messageCancel.set(res.message ?? null);
          this._errorMessageCancel.set(res.status ? null : res.message ?? 'تعذر إلغاء الهدية');
          this._walletFacade.fetchWallet();
        }),
        catchError((err) => {
          this._statusCancel.set(false);
          this._messageCancel.set(null);
          this._errorMessageCancel.set(err.message ?? 'حدث خطأ أثناء إلغاء الهدية');
          return EMPTY;
        }),
        finalize(() => {
          this._isLoadingCancel.set(false);
        })
      )
      .subscribe();
  }

  resetSendState(): void {
    this._isLoadingSend.set(false);
    this._errorMessageSend.set(null);
    this._statusSend.set(null);
  }

  resetAcceptState(): void {
    this._isLoadingAccept.set(false);
    this._errorMessageAccept.set(null);
    this._statusAccept.set(null);
    this._messageAccept.set(null);
  }

  resetCancelState(): void {
    this._isLoadingCancel.set(false);
    this._errorMessageCancel.set(null);
    this._statusCancel.set(null);
    this._messageCancel.set(null);
  }
}
