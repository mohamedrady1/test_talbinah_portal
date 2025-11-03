import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { UserAuthenticationApiClientProvider } from '../clients';
import { LocalizationService, ToastService, MoodModalIntegrationService, StorageKeys } from '../../../../shared';
import { ILoginRequestDto, ILoginResponseDto } from '../dtos';
import { ApiError, handleApiErrorsMessage, Logger, StorageService } from '../../../../common';
import { UserContextService } from './user-context.service';
interface LoginPasswordResultState {
    response: ILoginResponseDto | null;
    success: boolean;
    error: string | null;
    loginRequest: ILoginRequestDto | null;
}

const initialLoginPasswordResultState: LoginPasswordResultState = {
    response: null,
    success: false,
    error: null,
    loginRequest: null
};

@Injectable({ providedIn: 'root' })
export class LoginPasswordFacade {
    private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
    private readonly _toastService = inject(ToastService);
    private readonly _localizationService = inject(LocalizationService);
    private readonly _moodModalIntegrationService = inject(MoodModalIntegrationService);
    private readonly _storageService = inject(StorageService);
    private readonly _UserContextService = inject(UserContextService);
    private readonly _loginPasswordResultState = signal<LoginPasswordResultState>(initialLoginPasswordResultState);
    readonly loading = signal(false);

    readonly response = computed(() => this._loginPasswordResultState().response);
    readonly success = computed(() => this._loginPasswordResultState().success);
    readonly error = computed(() => this._loginPasswordResultState().error);
    readonly loginRequest = computed(() => this._loginPasswordResultState().loginRequest);

    login(params: ILoginRequestDto): void {
        Logger.debug('🚀 Sending login password request...');
        this.loading.set(true);
        this._loginPasswordResultState.set({ ...initialLoginPasswordResultState, loginRequest: params });

        this._apiClient.login(params).pipe(
            tap((response: ILoginResponseDto) => {
                if (response?.status) {
                    Logger.info('✅ Login password successful:', response);

                    // Show mood modal after successful login
                    setTimeout(() => {
                        // this._moodModalIntegrationService.checkMoodModal();
                    }, 1000);

                    this._loginPasswordResultState.set({
                        response,
                        success: true,
                        error: null,
                        loginRequest: params
                    });
                    this.saveUserDataAndUpdateUserInfoView(response);
                } else {
                    const message = response?.message || 'Failed to login';
                    Logger.warn('⚠️ Login password failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000
                    });
                    this._loginPasswordResultState.set({
                        response,
                        success: false,
                        error: message,
                        loginRequest: params
                    });
                }
            }),
            catchError((error: ApiError) => {
                const message = error?.message || 'Error connecting to server';
                Logger.error('❌ Login password error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: message,
                    life: 5000
                });
                this._loginPasswordResultState.set({
                    response: null,
                    success: false,
                    error: message,
                    loginRequest: params
                });
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }
    private saveUserDataAndUpdateUserInfoView(response: ILoginResponseDto): void {
        this._storageService.setItem(StorageKeys.TOKEN, response.data.token, true);
        this._storageService.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);
        this._UserContextService.recallUserDataViewed.next(true);
    }
    setError(message: string): void {
        this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
            detail: message,
            life: 5000
        });
        this._loginPasswordResultState.set({
            response: null,
            success: false,
            error: message,
            loginRequest: this._loginPasswordResultState().loginRequest
        });
    }

    reset(): void {
        this._loginPasswordResultState.set(initialLoginPasswordResultState);
        Logger.debug('🔄 Login password state reset.');
    }
}