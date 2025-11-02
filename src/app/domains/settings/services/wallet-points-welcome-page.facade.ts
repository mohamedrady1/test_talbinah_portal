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
import { IPointsResponseDto, IPointsServiceDto } from '../dtos';
import { Stats } from 'fs';

const POINTS_STATE_KEY = makeStateKey<PointsFeatureState>('pointsData');

export interface PointsState {
  title: string;
  description: string;
  services: IPointsServiceDto[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean;
}

export interface PointsFeatureState {
  state: PointsState;
}

export const initialPointsState: PointsFeatureState = {
  state: {
    title: '',
    description: '',
    services: [],
    isLoading: false,
    status: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class PointsFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<PointsFeatureState>(initialPointsState);

  readonly title = computed(() => this._state().state.title);
  readonly description = computed(() => this._state().state.description);
  readonly services = computed(() => this._state().state.services);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<PointsFeatureState>(POINTS_STATE_KEY, initialPointsState);
      // if (cached) {
      //   Logger.debug('Hydrating Points from TransferState', cached);
      //   this._state.set(cached);
      //   this._transferState.remove(POINTS_STATE_KEY);
      // }
    }
  }

  fetchPoints(): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._client.getPointsData() // You must implement this method
      .pipe(
        tap((res: IPointsResponseDto) => {
          const newState: PointsState = {
            title: res.data?.title || '',
            description: res.data?.description || '',
            services: res.data?.services || [],
            status: res?.status,
            isLoading: false,
            errorMessage: res.status ? null : (res.message ?? 'تعذر تحميل بيانات النقاط')
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(POINTS_STATE_KEY, { state: newState });
          }

          this._state.set({ state: newState });
        }),
        catchError(err => {
          Logger.error('PointsFacade: Failed to fetch points', err);
          this._updateState({
            title: '',
            description: '',
            services: [],
            isLoading: false,
            errorMessage: 'حدث خطأ أثناء تحميل النقاط'
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

  private _updateState(updates: Partial<PointsState>) {
    this._state.update(prev => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
