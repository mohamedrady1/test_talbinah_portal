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
      // const cached = this._transferState.get(STATE_KEY, null);
      // if (cached) {
      //   // Set loading to false when using cached data
      //   this._state.set({ ...cached, isLoading: false });
      //   this._transferState.remove(STATE_KEY);
      // }
    }
  }

  load(parent_id?: string | null): void {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    const startTime = Date.now();
    const minimumLoadingTime = 1000; // 1 second minimum loading

    this._apiClient.DoctorsFitrationParameters({ parent_id })
      .pipe(
        tap((res: IDoctorsFitrationParametersResponseDto) => {
          this._state.update(s => ({ ...s, status: res.status }));

          if (res.status && res.data) {
            /** 🔽 Transform specialties data */
            const specialties = res.data.specialties?.data ?? [];

            // Remove items with ids 1,3,4,5
            const filtered = specialties.filter(
              (item) => ![1, 3, 4, 5].includes(item.id)
            );

            // Create merged replacements (composite ids are strings)
            const mergedSpecialties = [
              {
                id: '1,4',
                name: 'طبيب',
                description: 'طبيب متخصص في التشخيص والعلاج الطبي للاضطرابات النفسية',
                image:
                  'https://talbinahprod.s3.eu-central-1.amazonaws.com/specialties-images/JAjviULnGIvkv2hKjYkabA5123RcTXOHsR5KO8i5.png',
                color: '#f2e3e9',
                is_report: 1,
                active: 1,
                original_active: 'فعال',
              },
              {
                id: '3,5',
                name: 'أخصائي اجتماعي وأسري',
                description:
                  'أخصائي متخصص في تقديم الدعم والاستشارات الاجتماعية والأسرية',
                image:
                  'https://talbinahprod.s3.eu-central-1.amazonaws.com/specialties-images/mt866VhJm6XwhMvROgIg3Mb7tNH6XgxmQpJ5zNVR.png',
                color: '#d6f6ff',
                is_report: 0,
                active: 1,
                original_active: 'فعال',
              },
            ];

            // ✅ Push merged items at the top (first)
            const updatedSpecialties = [...mergedSpecialties, ...filtered];

            // Cast to expected DTO
            const updatedData = {
              ...res.data,
              specialties: {
                ...res.data.specialties,
                data: updatedSpecialties,
              },
            } as unknown as IDoctorsFitrationParameters;

            this._state.update(s => ({
              ...s,
              parameters: updatedData,
              error: null,
            }));

            // TransferState only on server
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(STATE_KEY, this._state());
            }
          }
          else {
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
