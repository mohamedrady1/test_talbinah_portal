// domains/book-appointment-management/application/doctors-filtration-parameters.facade.ts

import {
  inject,
  Injectable,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError, finalize, EMPTY } from 'rxjs';
import { IDoctorsFitrationParameters, IDoctorsFitrationParametersResponseDto } from '../dtos';
import { BookAppointmentApiClientProvider } from '../clients';
import { ApiError, handleApiErrors } from '../../../common';

export interface IDoctorsFiltrationParametersState {
  isLoading: boolean;
  error: string | null;
  parameters: IDoctorsFitrationParameters | null;
  status: boolean | null;
}

const initialState: IDoctorsFiltrationParametersState = {
  isLoading: true, // Start with true to show skeleton on first load
  error: null,
  parameters: null,
  status: null,
};

const STATE_KEY = makeStateKey<IDoctorsFiltrationParametersState>('doctorsFiltrationParametersState');

@Injectable({ providedIn: 'root' })
export class DoctorsFitrationParametersFacade {
  private readonly _apiClient = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IDoctorsFiltrationParametersState>(initialState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly parameters = computed(() => this._state().parameters);
  readonly status = computed(() => this._state().status);
  readonly hasData = computed(() => !!this._state().parameters);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const cached = this._transferState.get(STATE_KEY, null);
      if (cached) {
        // Set loading to false when using cached data
        this._state.set({ ...cached, isLoading: false });
        this._transferState.remove(STATE_KEY);
      }
    }
  }

  load(parent_id?: string | null): void {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    const startTime = Date.now();
    const minimumLoadingTime = 1000; // 1 second minimum loading

    this._apiClient.DoctorsFitrationParameters({ parent_id: parent_id })
      .pipe(
        tap((res: IDoctorsFitrationParametersResponseDto) => {
          this._state.update(s => ({ ...s, status: res.status }));

          if (res.status && res.data) {
            this._state.update(s => ({ ...s, parameters: res.data, error: null }));

            // TransferState only on server
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(STATE_KEY, this._state());
            }
          } else {
            this._state.update(s => ({
              ...s,
              error: res.message ?? 'Failed to load doctors filtration parameters',
            }));
          }
        }),
        catchError((err: ApiError) => {
          handleApiErrors(err);
          this._state.update(s => ({
            ...s,
            error: err.message ?? 'Unexpected error occurred.',
            status: false,
          }));
          return EMPTY;
        }),
        finalize(() => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

          // Ensure loading shows for at least 1 second
          setTimeout(() => {
            this._state.update(s => ({ ...s, isLoading: false }));
          }, remainingTime);
        })
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialState);
  }
}
