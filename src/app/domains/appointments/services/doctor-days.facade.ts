import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError, finalize, EMPTY } from 'rxjs';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { IDoctorDaysLookupsResponseDto } from '../dtos';
import { Logger, handleApiErrors, ApiError } from '../../../common';

export interface IDoctorDaysState {
  isLoading: boolean;
  error: string | null;
  days: IDoctorDaysLookupsResponseDto['data']['days'];
  status: boolean | null;
}

const initialState: IDoctorDaysState = {
  isLoading: false,
  error: null,
  days: [],
  status: null,
};

const STATE_KEY = makeStateKey<IDoctorDaysState>('doctorDaysState');

@Injectable({ providedIn: 'root' })
export class DoctorDaysFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IDoctorDaysState>(initialState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly days = computed(() => this._state().days);
  readonly status = computed(() => this._state().status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(STATE_KEY);
      // }
    }
  }

  load(doctorId: number): void {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    this._apiClient.DoctorDaysByIdDoctor(doctorId)
      .pipe(
        tap((res: IDoctorDaysLookupsResponseDto) => {
          this._state.update(s => ({ ...s, status: res.status }));

          if (res.status) {
            this._state.update(s => ({ ...s, days: res.data.days, error: null }));
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(STATE_KEY, this._state());
            }
          } else {
            this._state.update(s => ({ ...s, error: res.message ?? 'Error fetching doctor days' }));
          }
        }),
        catchError((err: ApiError) => {
          handleApiErrors(err);
          this._state.update(s => ({ ...s, error: err.message ?? 'Unknown error', status: false }));
          return EMPTY;
        }),
        finalize(() => {
          this._state.update(s => ({ ...s, isLoading: false }));
        })
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialState);
  }
}
