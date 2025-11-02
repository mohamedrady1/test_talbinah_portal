import { response } from 'express';
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

import {
  AppointmentsApiClientProvider,
  IAppointmentsApiClient
} from '../clients';

import {
  ICheckPackagesReservationData,
  ICheckPackagesReservationParamsDto,
  ICheckPackagesReservationResponseDto
} from '../dtos';

import { Logger, handleApiErrors, ApiError } from '../../../common';

export interface IPackagesReservationState {
  isLoading: boolean;
  error: string | null;
  status: boolean | null;
  response: ICheckPackagesReservationData | null
}

const initialState: IPackagesReservationState = {
  isLoading: false,
  error: null,
  status: null,
  response: null
};

const STATE_KEY = makeStateKey<IPackagesReservationState>('packagesReservationState');

@Injectable({ providedIn: 'root' })
export class CheckPackagesReservationFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IPackagesReservationState>(initialState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly status = computed(() => this._state().status);
  readonly response = computed(() => this._state().response);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(STATE_KEY);
      // }
    }
  }

  check(params: ICheckPackagesReservationParamsDto): void {
    this._state.update(s => ({
      ...s,
      isLoading: true,
      error: null
    }));

    this._apiClient.CheckPackagesReservation(params)
      .pipe(
        tap((res: ICheckPackagesReservationResponseDto) => {
          this._state.update(s => ({
            ...s,
            status: res.status,
            response: res.data
          }));
          Logger.debug('ICheckPackagesReservationResponseDto: ', res.data);

          if (!res.status) {
            this._state.update(s => ({
              ...s,
              error: res.message ?? 'Failed to check package reservation'
            }));
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(STATE_KEY, this._state());
          }
        }),
        catchError((err: ApiError) => {
          handleApiErrors(err);
          this._state.update(s => ({
            ...s,
            error: err.message ?? 'Unexpected error',
            status: false
          }));
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
