import { inject, Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';

import { IResetPasswordRequestDto, IResetPasswordResponseDto } from '../dtos';
import { ApiError, handleApiErrorsMessage, Logger, NavigationIntent, NavigationStateService, StorageService, useNavigation } from '../../../../common';
import { UserAuthenticationApiClientProvider } from '../clients';
import { LocalizationService, StorageKeys, ToastService } from '../../../../shared';
import { MainPageRoutesEnum } from '../../../main-page';

interface ResetPasswordResultState {
    response: IResetPasswordResponseDto | null;
    success: boolean;
    error: ApiError | null;
}

const initialResetPasswordResultState: ResetPasswordResultState = {
    response: null,
    success: false,
    error: null,
};

@Injectable({ providedIn: 'root' })
export class ResetPasswordFacade {
    private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
    private readonly _toastService = inject(ToastService);
    private readonly _storageService = inject(StorageService);
    private readonly _navState = inject(NavigationStateService);
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly nav = useNavigation();

    private readonly _localizationService = inject(LocalizationService);

    // === STATE ===
    private readonly _resetPasswordResultState = signal<ResetPasswordResultState>(initialResetPasswordResultState);
    readonly loading = signal(false);

    // === COMPUTED SELECTORS ===
    readonly response = computed(() => this._resetPasswordResultState().response);
    readonly success = computed(() => this._resetPasswordResultState().success);
    readonly error = computed(() => this._resetPasswordResultState().error);

    /**
     * Calls the reset password API
     */
    resetPassword(params: IResetPasswordRequestDto): void {
        Logger.debug('🚀 Sending reset password request...');

        this.loading.set(true);
        this._resetPasswordResultState.set(initialResetPasswordResultState);

        this._apiClient.resetPassword(params).pipe(
            take(1),
            tap((response: IResetPasswordResponseDto) => {
                if (response.status) {
                    Logger.info('✅ Reset password successful:', response);
                    this._resetPasswordResultState.set({
                        response,
                        success: true,
                        error: null,
                    });
                    this.handleResetPasswordResponse(response);
                } else {
                    const message = response?.message || 'فشل في إعادة تعيين كلمة المرور';
                    Logger.warn('⚠️ Reset password failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000,
                    });
                    this._resetPasswordResultState.set({
                        response,
                        success: false,
                        error: { message } as ApiError,
                    });
                }
            }),
            catchError((error: ApiError) => {
                Logger.error('❌ Reset password error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: error?.message || 'خطأ في الاتصال بالسيرفر',
                    life: 5000,
                });
                this._resetPasswordResultState.set({
                    response: null,
                    success: false,
                    error,
                });
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    private handleResetPasswordResponse(response: IResetPasswordResponseDto): void {
        if (response.status) {
            this._storageService.setItem(StorageKeys.TOKEN, response.data.token, true);
            this._storageService.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);
            this.nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
        }
    }

    /**
     * Reset result state
     */
    reset(): void {
        this._resetPasswordResultState.set(initialResetPasswordResultState);
        Logger.debug('🔄 Reset password state reset.');
    }
}