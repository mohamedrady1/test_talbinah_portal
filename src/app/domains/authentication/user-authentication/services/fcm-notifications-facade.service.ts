import { Injectable, inject, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { UserAuthenticationApiClientProvider } from '../clients';
import { IUpdateFcmParamsRequest, IUpdateFcmParamsResponse } from '../dtos';
import { LocalizationService, ToastService } from '../../../../shared';
import { ApiError, handleApiErrors, Logger } from '../../../../common';
// --- State for the last update operation ---
interface LastUpdateFcmResultState {
  response: IUpdateFcmParamsResponse | null;
  success: boolean;
  error: string | null;
}

const initialLastUpdateFcmResultState: LastUpdateFcmResultState = {
  response: null,
  success: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class FcmNotificationsFacade {
  // --- Dependencies ---
  private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  // --- State ---
  private readonly _isLoading = signal<boolean>(false);
  private readonly _lastUpdateResultState = signal<LastUpdateFcmResultState>(initialLastUpdateFcmResultState);

  // --- Computed selectors ---
  readonly isLoading = computed(() => this._isLoading());
  readonly lastUpdateResponse = computed(() => this._lastUpdateResultState().response);
  readonly lastUpdateSuccess = computed(() => this._lastUpdateResultState().success);
  readonly lastUpdateError = computed(() => this._lastUpdateResultState().error);

  /**
   * Update FCM notification settings/token
   */
  updateFcmNotifications(params: IUpdateFcmParamsRequest): Observable<IUpdateFcmParamsResponse> {
    Logger.debug('FcmNotificationsFacade: Updating FCM notifications', params);

    this._isLoading.set(true);
    this._lastUpdateResultState.set({
      response: null,
      success: false,
      error: null,
    });

    return this._apiClient.UpdateFcmNotifications(params).pipe(
      tap((response: IUpdateFcmParamsResponse) => {
        if (response?.status) {
          Logger.debug('FcmNotificationsFacade: FCM notifications updated successfully', response);

          this._lastUpdateResultState.set({
            response,
            success: true,
            error: null,
          });
        } else {
          const message = response?.message || this._localizationService.translateTextFromJson('general.failedUpdateFcm');
          Logger.warn(`FcmNotificationsFacade: Failed to update FCM notifications: ${message}`);

          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: message,
            life: 5000,
          });

          this._lastUpdateResultState.set({
            response,
            success: false,
            error: message,
          });

          throw new Error(message);
        }
      }),
      catchError((error: ApiError) => {
        const message = error?.message || this._localizationService.translateTextFromJson('general.errorUpdatingFcm');
        Logger.error('FcmNotificationsFacade: Error updating FCM notifications', error);
        handleApiErrors(error);

        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('general.error'),
          detail: message,
          life: 5000,
        });

        this._lastUpdateResultState.set({
          response: { status: false, message, data: null },
          success: false,
          error: message,
        });

        return EMPTY;
      }),
      finalize(() => {
        this._isLoading.set(false);
        Logger.debug('FcmNotificationsFacade: Finished update operation');
      })
    );
  }

  resetLastUpdateResultState(): void {
    this._lastUpdateResultState.set(initialLastUpdateFcmResultState);
    Logger.debug('FcmNotificationsFacade: Last update result state reset.');
  }
}
