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
import { SettingsApiClientProvider } from '../clients';
import { IWalletPointsRecordsDataDto, IWalletPointsRecordsResponseDto } from '../dtos';


const WALLET_POINTS_STATE_KEY = makeStateKey<IWalletPointsRecordsFeatureState>('walletPointsRecords');

interface IWalletPointsRecordsState {
  data: IWalletPointsRecordsDataDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

interface IWalletPointsRecordsFeatureState {
  state: IWalletPointsRecordsState;
}

const initialWalletPointsState: IWalletPointsRecordsFeatureState = {
  state: {
    data: null,
    isLoading: false,
    errorMessage: null,
    status: false
  }
};

@Injectable({ providedIn: 'root' })
export class WalletPointsRecordsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IWalletPointsRecordsFeatureState>(initialWalletPointsState);

  readonly data = computed(() => this._state().state.data);
  readonly balance = computed(() => this._state().state.data?.balance ?? 0);
  readonly title = computed(() => this._state().state.data?.title ?? '');
  readonly description = computed(() => this._state().state.data?.description ?? '');
  readonly movements = computed(() => this._state().state.data?.movement ?? []);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<IWalletPointsRecordsFeatureState>(
      //   WALLET_POINTS_STATE_KEY,
      //   initialWalletPointsState
      // );
      // if (cached) {
      //   Logger.debug('[WalletPointsRecordsFacade] Hydrated from TransferState');
      //   this._state.set(cached);
      //   this._transferState.remove(WALLET_POINTS_STATE_KEY);
      // }
    }
  }

  fetchWalletPoints(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client
      .getWalletPointsRecords()
      .pipe(
        tap((res: IWalletPointsRecordsResponseDto) => {
          const newState: IWalletPointsRecordsState = {
            data: res.data,
            status: res.status,
            isLoading: false,
            errorMessage: res.status ? null : res.message ?? 'تعذر تحميل سجل النقاط'
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(WALLET_POINTS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('[WalletPointsRecordsFacade] Failed to fetch records', err);
          this._updateState({
            data: null,
            isLoading: false,
            errorMessage: 'حدث خطأ أثناء تحميل سجل النقاط'
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

  private _updateState(updates: Partial<IWalletPointsRecordsState>) {
    this._state.update((prev) => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }

  resetWalletPoints(): void {
    this._state.set(initialWalletPointsState);
  }
}
