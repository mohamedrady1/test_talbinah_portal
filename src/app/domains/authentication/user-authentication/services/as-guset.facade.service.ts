import { ApiError, handleApiErrorsMessage, Logger } from '../../../../common';
import { LocalizationService, ToastService } from '../../../../shared';
import { inject, Injectable, signal, computed } from '@angular/core';
import { UserAuthenticationApiClientProvider } from '../clients';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IAsGuestResponseDto } from '../dtos';

interface AsGuestResultState {
  response: IAsGuestResponseDto | null;
  success: boolean;
  error: string | null;
}

const initialAsGuestResultState: AsGuestResultState = {
  response: null,
  success: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AsGuestFacade {
  private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  private readonly _asGuestResultState = signal<AsGuestResultState>(initialAsGuestResultState);
  readonly loading = signal(false);

  readonly response = computed(() => this._asGuestResultState().response);
  readonly success = computed(() => this._asGuestResultState().success);
  readonly error = computed(() => this._asGuestResultState().error);

  asGuest(): void {
    Logger.debug('🚀 AsGuestFacade | Sending asGuest request...');
    this.loading.set(true);
    this._asGuestResultState.set(initialAsGuestResultState);

    this._apiClient.asGuest().pipe(
      tap((response: IAsGuestResponseDto) => {
        if (response) {
          Logger.info('✅ AsGuestFacade | As guest successful:', response);
          this._asGuestResultState.set({
            response,
            success: true,
            error: null,
          });
        } else {
          const message = 'AsGuestFacade | Failed to process guest request';
          Logger.warn('⚠️ AsGuestFacade | As guest failed:', message);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: message,
            life: 5000
          });
          this._asGuestResultState.set({
            response: null,
            success: false,
            error: message,
          });
        }
      }),
      catchError((error: ApiError) => {
        const message = error?.message || 'Error connecting to server';
        Logger.error('❌ AsGuestFacade | As guest error:', error);
        handleApiErrorsMessage(error);
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
          detail: message,
          life: 5000
        });
        this._asGuestResultState.set({
          response: null,
          success: false,
          error: message,
        });
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  setError(message: string): void {
    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
      detail: message,
      life: 5000
    });
    this._asGuestResultState.set({
      response: null,
      success: false,
      error: message,
    });
  }

  reset(): void {
    this._asGuestResultState.set(initialAsGuestResultState);
    Logger.debug('🔄AsGuestFacade | As guest state reset.');
  }
}
