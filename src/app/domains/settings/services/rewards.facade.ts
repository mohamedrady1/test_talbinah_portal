import {
  Injectable,
  PLATFORM_ID,
  inject,
  makeStateKey,
  TransferState,
  signal,
  computed
} from '@angular/core';
import { IRewardsResponseDto, RewardItem } from '../dtos';
import { Logger, handleApiErrors } from '../../../common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { SettingsApiClientProvider } from '../clients';
import { isPlatformBrowser } from '@angular/common';

const REWARDS_STATE_KEY = makeStateKey<IRewardsFeatureState>('rewards');

interface IRewardsState {
  items: RewardItem[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

interface IRewardsFeatureState {
  state: IRewardsState;
}

const initialRewardsState: IRewardsFeatureState = {
  state: {
    items: [],
    isLoading: false,
    errorMessage: null,
    status: false
  }
};

@Injectable({ providedIn: 'root' })
export class RewardsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IRewardsFeatureState>(initialRewardsState);

  readonly items = computed(() => this._state().state.items);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<IRewardsFeatureState>(
      //   REWARDS_STATE_KEY,
      //   initialRewardsState
      // );
      // if (cached) {
      //   Logger.debug('[RewardsFacade] Hydrated from TransferState');
      //   this._state.set(cached);
      //   this._transferState.remove(REWARDS_STATE_KEY);
      // }
    }
  }

  fetchRewards(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client
      .getFetchRewards()
      .pipe(
        tap((res: IRewardsResponseDto) => {
          const newState: IRewardsState = {
            items: res.data ?? [],
            status: res.status,
            isLoading: false,
            errorMessage: res.status ? null : res.message ?? 'Failed to load rewards'
          };

          // Store in TransferState for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(REWARDS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError((err) => {
          Logger.error('[RewardsFacade] Failed to fetch rewards', err);
          this._updateState({
            items: [],
            isLoading: false,
            errorMessage: err.message || 'An error occurred while loading rewards'
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

  private _updateState(updates: Partial<IRewardsState>) {
    this._state.update(prev => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }

  reset(): void {
    this._state.set(initialRewardsState);
  }
}
