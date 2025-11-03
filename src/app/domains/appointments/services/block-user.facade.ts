import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState, } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { IBlockUserActionData, IBlockUserResponseDto } from '../dtos';
import { Logger, handleApiErrors, ApiError } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';

// --- STATE INTERFACE ---
export interface IBlockUserState {
  isLoading: boolean;
  error: string | null;
  result: IBlockUserActionData | null;
  isSuccess: boolean;
}

// --- INITIAL STATE ---
const initialBlockUserState: IBlockUserState = {
  isLoading: false,
  error: null,
  result: null,
  isSuccess: false
};

// --- SSR STATE KEY ---
const BLOCK_USER_STATE_KEY = makeStateKey<IBlockUserState>('blockUserState');

// --- FACADE SERVICE ---
@Injectable({ providedIn: 'root' })
export class BlockUserFacade {
  // Dependencies
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // State
  private readonly _state = signal<IBlockUserState>(initialBlockUserState);

  // Selectors
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);
  readonly result = computed(() => this._state().result);
  readonly isSuccess = computed(() => this._state().isSuccess);

  constructor() {
    // SSR hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(BLOCK_USER_STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(BLOCK_USER_STATE_KEY);
      //   Logger.debug('Hydrated block user state from TransferState:', cached);
      // }
    }
  }

  /**
   * Calls API to block a doctor by ID.
   */
  blockDoctorById(doctorId: number): void {
    Logger.debug(`Requesting to block doctor ID: ${doctorId}`);
    this.updateState({ isLoading: true, error: null });

    this._apiClient.BlockUserById(doctorId)
      .pipe(
        tap((response: IBlockUserResponseDto) => {
          if (response.status) {
            this.updateState({
              result: response.data,
              error: null,
              isSuccess: true, // ✅ SUCCESS FLAG
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(BLOCK_USER_STATE_KEY, this._state());
              Logger.debug('Stored block doctor result in TransferState.');
            }

            this._toastService.add({
              severity: 'success',
              summary: this._localizationService.translateTextFromJson('general.success'),
              detail: response.message || this._localizationService.translateTextFromJson('BlockDoctorModal.confirmBlockSuccess'),
              life: 5000
            });
          } else {
            const fallback = this._localizationService.translateTextFromJson('BlockDoctorModal.confirmBlockFailed');
            this.handleError({ message: response.message || fallback } as ApiError, fallback);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'BlockDoctorModal.confirmBlockFailed');
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  /**
   * Reset the block user state.
   */
  reset(): void {
    this._state.set(initialBlockUserState);
    Logger.debug('Block user state reset.');
  }

  // --- UTILITY METHODS ---

  private updateState(updates: Partial<IBlockUserState>): void {
    this._state.update((current) => ({ ...current, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error('Error while blocking doctor:', error);
    handleApiErrors(error);

    const errorMessage = error?.message || this._localizationService.translateTextFromJson('an_error_has_occurred');
    this.updateState({ error: errorMessage });

    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
      detail: errorMessage,
      life: 5000
    });
  }
}
