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
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import {
  ITechnicalSupportApiClient,
  TechnicalSupportApiClientProvider
} from '../clients';
import { Logger, ApiError, handleApiErrors } from '../../../common';

// --- DTOs ---
export interface ITechnicalSupportDepartmentDto {
  id: number;
  title: string;
}

export interface ITechnicalSupportDepartmentsResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportDepartmentDto[];
}

// --- State Key for SSR hydration ---
const TECHNICAL_SUPPORT_DEPARTMENTS_STATE_KEY =
  makeStateKey<TechnicalSupportDepartmentsFeatureState>('technicalSupportDepartments');

// --- State Shape ---
export interface TechnicalSupportDepartmentsListState {
  departments: ITechnicalSupportDepartmentDto[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface TechnicalSupportDepartmentsFeatureState {
  technicalSupportDepartments: TechnicalSupportDepartmentsListState;
}

// --- Initial State ---
export const initialTechnicalSupportDepartmentsFeatureState: TechnicalSupportDepartmentsFeatureState = {
  technicalSupportDepartments: {
    departments: [],
    isLoading: false,
    errorMessage: null
  }
};

@Injectable({ providedIn: 'root' })
export class TechnicalSupportDepartmentsFacade {
  private readonly _apiClient: ITechnicalSupportApiClient =
    inject(TechnicalSupportApiClientProvider).getClient();

  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _featureState = signal<TechnicalSupportDepartmentsFeatureState>(
    initialTechnicalSupportDepartmentsFeatureState
  );

  // --- Selectors ---
  readonly departments = computed(
    () => this._featureState().technicalSupportDepartments.departments
  );
  readonly isLoading = computed(
    () => this._featureState().technicalSupportDepartments.isLoading
  );
  readonly errorMessage = computed(
    () => this._featureState().technicalSupportDepartments.errorMessage
  );

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState =
      //   this._transferState.get<TechnicalSupportDepartmentsFeatureState>(
      //     TECHNICAL_SUPPORT_DEPARTMENTS_STATE_KEY,
      //     initialTechnicalSupportDepartmentsFeatureState
      //   );

      // if (cachedState) {
      //   Logger.debug('Hydrating support departments from TransferState', cachedState);
      //   this._updateDepartmentsState(cachedState.technicalSupportDepartments);
      //   this._transferState.remove(TECHNICAL_SUPPORT_DEPARTMENTS_STATE_KEY);
      // }
    }
  }

  fetchDepartments(): void {
    Logger.debug('Fetching technical support departments list');

    this._updateDepartmentsState({ isLoading: true, errorMessage: null });

    this._apiClient
      .getTechnicalSupportDepartments()
      .pipe(
        tap((response: ITechnicalSupportDepartmentsResponseDto) => {
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(
              TECHNICAL_SUPPORT_DEPARTMENTS_STATE_KEY,
              this._featureState()
            );
            Logger.debug('Stored technical support departments in TransferState for SSR');
          }

          this._updateDepartmentsState({
            departments: response.data,
            errorMessage: null
          });

          Logger.debug('Technical support departments response: ', {
            errorMessage: this.errorMessage(),
            departments: this.departments()
          });
        }),
        catchError((error: ApiError) => {
          this._updateDepartmentsState({
            errorMessage: '🚨 Error loading departments. Please try again later.',
            departments: []
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateDepartmentsState({ isLoading: false });
        })
      )
      .subscribe();
  }

  private _updateDepartmentsState(
    updates: Partial<TechnicalSupportDepartmentsListState>
  ): void {
    this._featureState.update(state => ({
      ...state,
      technicalSupportDepartments: {
        ...state.technicalSupportDepartments,
        ...updates
      }
    }));
  }
}
