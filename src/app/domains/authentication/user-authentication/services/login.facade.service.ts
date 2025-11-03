import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { LocalizationService, ToastService } from '../../../../shared';
import { UserAuthenticationApiClientProvider } from '../clients';
import { ICheckNumberParams, ICheckNumberResponseDto } from '../dtos';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../../common';

interface LoginResultState {
    response: ICheckNumberResponseDto | null;
    success: boolean;
    error: string | null;
    checkNumberRequest: ICheckNumberParams | null;
}

const initialLoginResultState: LoginResultState = {
    response: null,
    success: false,
    error: null,
    checkNumberRequest: null
};

@Injectable({ providedIn: 'root' })
export class LoginFacade {
    private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
    private readonly _toastService = inject(ToastService);
    private readonly _localizationService = inject(LocalizationService);

    private readonly _loginResultState = signal<LoginResultState>(initialLoginResultState);
    readonly loading = signal(false);

    readonly response = computed(() => this._loginResultState().response);
    readonly success = computed(() => this._loginResultState().success);
    readonly error = computed(() => this._loginResultState().error);
    readonly checkNumberRequest = computed(() => this._loginResultState().checkNumberRequest);

    checkNumber(params: ICheckNumberParams): void {
        Logger.debug('🚀 Sending check number request...');
        this.loading.set(true);
        this._loginResultState.set({ ...initialLoginResultState, checkNumberRequest: params });

        this._apiClient.checkNumer(params).pipe(
            tap((response: ICheckNumberResponseDto) => {
                if (response?.status) {
                    Logger.info('✅ Check number successful:', response);
                    this._loginResultState.set({
                        response,
                        success: true,
                        error: null,
                        checkNumberRequest: params
                    });
                } else {
                    const message = response?.message || 'Failed to check number';
                    Logger.warn('⚠️ Check number failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000
                    });
                    this._loginResultState.set({
                        response,
                        success: false,
                        error: message,
                        checkNumberRequest: params
                    });
                }
            }),
            catchError((error: ApiError) => {
                const message = error?.message || 'Error connecting to server';
                Logger.error('❌ Check number error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: message,
                    life: 5000
                });
                this._loginResultState.set({
                    response: null,
                    success: false,
                    error: message,
                    checkNumberRequest: params
                });
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    reset(): void {
        this._loginResultState.set(initialLoginResultState);
        Logger.debug('🔄 Login state reset.');
    }
}