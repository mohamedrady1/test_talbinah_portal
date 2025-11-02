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
import { handleApiErrors, Logger } from '../../../common';
import { IPointsGiftsResponseDto, IPointsGiftDto } from '../dtos';

const GIFTS_STATE_KEY = makeStateKey<PointsGiftsFeatureState>('pointsGifts');

interface PointsGiftsState {
  gifts: IPointsGiftDto[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

interface PointsGiftsFeatureState {
  state: PointsGiftsState;
}

const initialGiftsState: PointsGiftsFeatureState = {
  state: {
    gifts: [],
    isLoading: false,
    errorMessage: null,
    status: false
  }
};

@Injectable({ providedIn: 'root' })
export class PointsGiftsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<PointsGiftsFeatureState>(initialGiftsState);

  readonly gifts = computed(() => this._state().state.gifts);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<PointsGiftsFeatureState>(
      //   GIFTS_STATE_KEY,
      //   initialGiftsState
      // );
      // if (cached) {
      //   Logger.debug('Hydrating Points Gifts from TransferState', cached);
      //   this._state.set(cached);
      //   this._transferState.remove(GIFTS_STATE_KEY);
      // }
    }
  }

  fetchGifts(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client
      .getPointsGifts()
      .pipe(
        tap((res: IPointsGiftsResponseDto) => {
          const rawGifts = res.data ?? [];

          const filteredGifts: IPointsGiftDto[] = rawGifts.filter(
            (gift) =>
              gift.service_key !== null &&
              gift.service_key !== '' &&
              gift.points !== null &&
              gift.points !== ''
          );

          const newState: PointsGiftsState = {
            gifts: filteredGifts,
            status: res.status,
            isLoading: false,
            errorMessage: res.status ? null : res.message ?? 'تعذر تحميل بيانات الهدايا'
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(GIFTS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('PointsGiftsFacade: Failed to fetch gifts', err);
          this._updateState({
            gifts: [],
            isLoading: false,
            errorMessage: 'حدث خطأ أثناء تحميل بيانات الهدايا'
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

  private _updateState(updates: Partial<PointsGiftsState>) {
    this._state.update((prev) => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
