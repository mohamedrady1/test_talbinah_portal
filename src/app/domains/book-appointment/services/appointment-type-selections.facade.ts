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
import {
  IAppointmentTypeSelectionItem,
  IAppointmentTypeSelectionsResponseDto,
} from '../dtos';
import { BookAppointmentApiClientProvider } from '../clients';
import { ApiError, handleApiErrors } from '../../../common';

export interface IAppointmentTypeSelectionsState {
  isLoading: boolean;
  error: string | null;
  selections: IAppointmentTypeSelectionItem[] | null;
  status: boolean | null;
}

const initialState: IAppointmentTypeSelectionsState = {
  isLoading: false,
  error: null,
  selections: null,
  status: null,
};

const STATE_KEY = makeStateKey<IAppointmentTypeSelectionsState>(
  'appointmentTypeSelectionsState'
);

@Injectable({ providedIn: 'root' })
export class AppointmentTypeSelectionsFacade {
  private readonly _apiClient = inject(BookAppointmentApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _state = signal<IAppointmentTypeSelectionsState>(initialState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly selections = computed(() => this._state().selections);
  readonly status = computed(() => this._state().status);
  readonly hasData = computed(() => !!this._state().selections?.length);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // Uncomment if you want to restore cached data
      // const cached = this._transferState.get(STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(STATE_KEY);
      // }
    }
  }

  load(): void {
    this._state.update((s) => ({ ...s, isLoading: true, error: null }));

    this._apiClient
      .AppointmentTypeSelections()
      .pipe(
        tap((res: IAppointmentTypeSelectionsResponseDto) => {
          this._state.update((s) => ({ ...s, status: res.status }));

          if (res.status && res.data) {
            this._state.update((s) => ({
              ...s,
              selections: res.data ?? null,
              error: null,
            }));


            // Save in TransferState only when running on the server
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(STATE_KEY, this._state());
            }
          } else {
            this._state.update((s) => ({
              ...s,
              error: res.message ?? 'Failed to load appointment type selections',
            }));
          }
        }),
        catchError((err: ApiError) => {
          handleApiErrors(err);
          this._state.update((s) => ({
            ...s,
            error: err.message ?? 'Unexpected error occurred.',
            status: false,
          }));
          return EMPTY;
        }),
        finalize(() => {
          this._state.update((s) => ({ ...s, isLoading: false }));
        })
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialState);
  }
}
