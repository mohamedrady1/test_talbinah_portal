import {
  inject,
  Injectable,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
  signal,
  computed,
  effect
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { SettingsApiClientProvider } from '../clients';
import {
  IGlobalDoctorContactInfoModel,
  IPaginationParameters,
  Logger,
  handleApiErrors
} from '../../../common';
import { IGovernmentAgencyDoctorsResponseDto } from '../dtos';

const DOCTORS_STATE_KEY = makeStateKey<GovernmentAgenciesDoctorsFeatureState>('governmentAgenciesDoctors');

const DEFAULT_DOCTOR_FILTERS: IPaginationParameters = {
  page: 1,
  per_page: 10,
  total: 10,
  search: undefined,
  specialty: undefined,
  day: undefined,
  services_ids: undefined,
  languages_ids: undefined,
  gender: undefined,
  min_price: undefined,
  max_price: undefined,
  rate: undefined,
  status: undefined,
};

export interface GovernmentAgenciesDoctorsState {
  doctors: IGlobalDoctorContactInfoModel[];
  response: IGovernmentAgencyDoctorsResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface GovernmentAgenciesDoctorsFeatureState {
  state: GovernmentAgenciesDoctorsState;
}

const initialState: GovernmentAgenciesDoctorsFeatureState = {
  state: {
    doctors: [],
    response: null,
    isLoading: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class GovernmentAgenciesDoctorsFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _state = signal<GovernmentAgenciesDoctorsFeatureState>(initialState);
  private readonly _filters = signal<IPaginationParameters>({ ...DEFAULT_DOCTOR_FILTERS });

  readonly doctors = computed(() => this._state().state.doctors);
  readonly response = computed(() => this._state().state.response);
  readonly isLoading = computed(() => this._state().state.isLoading);
  readonly errorMessage = computed(() => this._state().state.errorMessage);
  readonly status = computed(() => this._state().state.response?.status ?? false);
  readonly filters = computed(() => this._filters());

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get<GovernmentAgenciesDoctorsFeatureState>(
      //   DOCTORS_STATE_KEY,
      //   initialState
      // );
      // if (cached) {
      //   Logger.debug('Hydrating Government Agencies Doctors from TransferState', cached);
      //   this._updateState(cached.state);
      //   this._transferState.remove(DOCTORS_STATE_KEY);
      // }
    }

    // Automatically fetch doctors on filter changes
    effect(() => {
      this.fetchDoctors(this._filters());
    });
  }

  private fetchDoctors(params: IPaginationParameters): void {
    this._updateState({ isLoading: true, errorMessage: null });

    const formatted = this.formatParams(params);

    this._apiClient
      .getGovernmentAgenciesDoctors(formatted)
      .pipe(
        tap((res: IGovernmentAgencyDoctorsResponseDto) => {
          const doctors = res.data ?? [];

          const newState: GovernmentAgenciesDoctorsState = {
            doctors,
            response: res,
            isLoading: false,
            errorMessage: res.status ? null : (res.message ?? 'فشل تحميل الدكاترة')
          };

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(DOCTORS_STATE_KEY, { state: newState });
            Logger.debug('Stored doctors in TransferState for SSR');
          }

          this._state.set({ state: newState });
        }),
        catchError(err => {
          Logger.error('Error fetching government agency doctors:', err);
          this._updateState({
            doctors: [],
            response: null,
            isLoading: false,
            errorMessage: '🚨 فشل في تحميل الدكاترة. حاول مرة أخرى.'
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

  updateFilters(filters: Partial<IPaginationParameters>): void {
    this._filters.update(prev => {
      const merged = { ...prev, ...filters };
      const filtersChanged = Object.keys(filters).some(
        key => !['page', 'total'].includes(key) && prev[key as keyof IPaginationParameters] !== filters[key as keyof IPaginationParameters]
      );
      if (filtersChanged) merged.page = 1; // Reset page when filters change
      return merged;
    });
  }

  setPage(page: number): void {
    if (page < 1) page = 1;
    this._filters.update(prev => ({ ...prev, page }));
  }

  resetFilters(): void {
    this._filters.set({ ...DEFAULT_DOCTOR_FILTERS });
  }

  clear(): void {
    this._state.set(initialState);
    this.resetFilters();
  }

  private _updateState(updates: Partial<GovernmentAgenciesDoctorsState>): void {
    this._state.update(prev => ({
      state: {
        ...prev.state,
        ...updates
      }
    }));
  }

  private formatParams(params: IPaginationParameters): IPaginationParameters {
    const result: any = { ...params };
    if (Array.isArray(result.services_ids)) {
      result.services_ids = result.services_ids.join(',');
    }
    if (Array.isArray(result.languages_ids)) {
      result.languages_ids = result.languages_ids.join(',');
    }
    return result;
  }
}
