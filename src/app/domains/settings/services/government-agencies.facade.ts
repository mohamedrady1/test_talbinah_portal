import {
  inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { SettingsApiClientProvider } from '../clients';
import {
  IGovernmentAgenciesResponseDto,
  IGovernmentAgencyItemdDto
} from '../dtos';

import { Logger, handleApiErrors } from '../../../common';

const AGENCIES_STATE_KEY = makeStateKey<GovernmentAgenciesFeatureState>('governmentAgencies');

export interface GovernmentAgenciesState {
  agencies: IGovernmentAgencyItemdDto[];
  response: IGovernmentAgenciesResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface GovernmentAgenciesFeatureState {
  state: GovernmentAgenciesState;
}

export const initialGovernmentAgenciesFeatureState: GovernmentAgenciesFeatureState = {
  state: {
    agencies: [],
    response: null,
    isLoading: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class GovernmentAgenciesFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _featureState = signal<GovernmentAgenciesFeatureState>(initialGovernmentAgenciesFeatureState);

  readonly agencies = computed(() => this._featureState().state.agencies);
  readonly response = computed(() => this._featureState().state.response);
  readonly isLoading = computed(() => this._featureState().state.isLoading);
  readonly errorMessage = computed(() => this._featureState().state.errorMessage);
  readonly status = computed(() => this._featureState().state.response?.status ?? false);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<GovernmentAgenciesFeatureState>(
      //   AGENCIES_STATE_KEY,
      //   initialGovernmentAgenciesFeatureState
      // );

      // if (cached) {
      //   Logger.debug('Hydrating Government Agencies from TransferState', cached);
      //   this._updateState(cached.state);
      //   this._transferState.remove(AGENCIES_STATE_KEY);
      // }
    }
  }

  fetchAgencies(): void {
    Logger.debug('GovernmentAgenciesFacade: Fetching government agencies');

    this._updateState({ isLoading: true, errorMessage: null });

    this._apiClient
      .getGovernmentAgencies()
      .pipe(
        tap((res: IGovernmentAgenciesResponseDto) => {
          const agencies = res.data ?? [];
          Logger.debug('Agencies Resposne: ', {
            errorMessage: this.errorMessage(),
            agencies: res.data
          });

          const newState: GovernmentAgenciesState = {
            agencies,
            response: res,
            isLoading: false,
            errorMessage: res.status ? null : (res.message ?? 'Failed to load agencies')
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(AGENCIES_STATE_KEY, { state: newState });
            Logger.debug('Stored agencies in TransferState for SSR');
          }
          this._featureState.set({ state: newState });
        }),
        catchError(err => {
          Logger.error('GovernmentAgenciesFacade: Error fetching agencies', err);

          this._updateState({
            agencies: [],
            response: null,
            isLoading: false,
            errorMessage: '🚨 Error loading agencies. Please try again later.'
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

  clearError(): void {
    this._updateState({ errorMessage: null });
  }

  clearAgencies(): void {
    this._updateState({
      agencies: [],
      response: null
    });
  }

  private _updateState(updates: Partial<GovernmentAgenciesState>) {
    this._featureState.update(prev => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }
}
