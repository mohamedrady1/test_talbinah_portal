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
import { IServicePointsGiftItemDto, IServicePointsGiftsResponseDto } from '../dtos';

const SERVICE_POINTS_GIFTS_STATE_KEY = makeStateKey<IServicePointsGiftsFeatureState>('servicePointsGifts');

interface IServicePointsGiftsState {
  items: IServicePointsGiftItemDto[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

interface IServicePointsGiftsFeatureState {
  state: IServicePointsGiftsState;
}

const initialServicePointsGiftsState: IServicePointsGiftsFeatureState = {
  state: {
    items: [],
    isLoading: false,
    errorMessage: null,
    status: false
  }
};

@Injectable({ providedIn: 'root' })
export class ServicePointsGiftsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IServicePointsGiftsFeatureState>(initialServicePointsGiftsState);

  readonly items = computed(() => this._state().state.items);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<IServicePointsGiftsFeatureState>(
      //   SERVICE_POINTS_GIFTS_STATE_KEY,
      //   initialServicePointsGiftsState
      // );
      // if (cached) {
      //   Logger.debug('[ServicePointsGiftsFacade] Hydrated from TransferState');
      //   this._state.set(cached);
      //   this._transferState.remove(SERVICE_POINTS_GIFTS_STATE_KEY);
      // }
    }
  }

  fetchServicePointsGifts(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client
      .getServicePointsGifts()
      .pipe(
        tap((res: IServicePointsGiftsResponseDto) => {
          const newState: IServicePointsGiftsState = {
            items: res.data ?? [],
            status: res.status,
            isLoading: false,
            errorMessage: res.status ? null : res.message ?? 'تعذر تحميل هدايا نقاط الخدمات'
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(SERVICE_POINTS_GIFTS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('[ServicePointsGiftsFacade] Failed to fetch', err);
          this._updateState({
            items: [],
            isLoading: false,
            errorMessage: 'حدث خطأ أثناء تحميل هدايا نقاط الخدمات'
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

  private _updateState(updates: Partial<IServicePointsGiftsState>) {
    this._state.update((prev) => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
