import { inject, Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserAuthenticationApiClientProvider } from '../clients';
import { LocalizationService, StorageKeys, ToastService, MoodModalIntegrationService } from '../../../../shared';
import { ApiError, handleApiErrorsMessage, Logger, NavigationIntent, NavigationStateService, StorageService, useNavigation } from '../../../../common';
import { ILoginRequestDto, ILoginResponseDto, IMethodSelectionParams, IMethodSelectionResponseDto, IOtpVerificationRequestDto, IOtpVerificationResponseDto } from '../dtos';
import { MainPageRoutesEnum } from '../../../main-page';
import { AuthenticationRoutesEnum } from '../constants';

interface OtpVerificationResultState {
    verifyCodeResponse: IOtpVerificationResponseDto | null;
    methodSelectionResponse: IMethodSelectionResponseDto | null;
    loginResponse: ILoginResponseDto | null;
    success: boolean;
    error: ApiError | null;
}

const initialOtpVerificationResultState: OtpVerificationResultState = {
    verifyCodeResponse: null,
    methodSelectionResponse: null,
    loginResponse: null,
    success: false,
    error: null,
};

@Injectable({ providedIn: 'root' })
export class OtpVerificationFacade {
    private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
    private readonly _toastService = inject(ToastService);
    private readonly _storageService = inject(StorageService);
    private readonly _navState = inject(NavigationStateService);
    private readonly _moodModalIntegrationService = inject(MoodModalIntegrationService);
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _localizationService = inject(LocalizationService);
    private readonly _nav = useNavigation();
    // === STATE ===
    private readonly _otpVerificationResultState = signal<OtpVerificationResultState>(initialOtpVerificationResultState);
    readonly loading = signal(false);
    readonly loadingResend = signal(false);
    readonly loadingLogin = signal(false);

    // === COMPUTED SELECTORS ===
    readonly verifyCodeResponse = computed(() => this._otpVerificationResultState().verifyCodeResponse);
    readonly methodSelectionResponse = computed(() => this._otpVerificationResultState().methodSelectionResponse);
    readonly loginResponse = computed(() => this._otpVerificationResultState().loginResponse);
    readonly success = computed(() => this._otpVerificationResultState().success);
    readonly error = computed(() => this._otpVerificationResultState().error);

    /**
     * Calls the verify code API
     */
    verifyCode(params: IOtpVerificationRequestDto): void {
        Logger.debug('🚀 Sending verify code request...');

        this.loading.set(true);
        this._otpVerificationResultState.set({ ...initialOtpVerificationResultState });

        this._apiClient.verifyCode(params).pipe(
            take(1),
            tap((response: IOtpVerificationResponseDto) => {
                if (response.status) {
                    Logger.info('✅ Verify code successful:', response);
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        verifyCodeResponse: response,
                        success: true,
                        error: null,
                    });
                } else {
                    const message = response?.message || 'فشل في التحقق من الكود';
                    Logger.warn('⚠️ Verify code failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000,
                    });
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        verifyCodeResponse: response,
                        success: false,
                        error: { message } as ApiError,
                    });
                }
            }),
            catchError((error: ApiError) => {
                Logger.error('❌ Verify code error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: error?.message || 'خطأ في الاتصال بالسيرفر',
                    life: 5000,
                });
                this._otpVerificationResultState.set({
                    ...this._otpVerificationResultState(),
                    verifyCodeResponse: null,
                    success: false,
                    error,
                });
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    /**
     * Calls the method selection (resend code) API
     */
    resendCode(params: IMethodSelectionParams): void {
        Logger.debug('🚀 Sending resend code request...');

        this.loadingResend.set(true);
        this._otpVerificationResultState.set({ ...initialOtpVerificationResultState });

        this._apiClient.methodSelection(params).pipe(
            take(1),
            tap((response: IMethodSelectionResponseDto) => {
                if (response.status) {
                    Logger.info('✅ Resend code successful:', response);
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        methodSelectionResponse: response,
                        success: true,
                        error: null,
                    });
                } else {
                    const message = response?.message || 'فشل في إعادة إرسال الكود';
                    Logger.warn('⚠️ Resend code failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: 'failed_to_resend_verification_code',
                        life: 5000,
                    });
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        methodSelectionResponse: response,
                        success: false,
                        error: { message } as ApiError,
                    });
                }
            }),
            catchError((error: ApiError) => {
                Logger.error('❌ Resend code error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: 'failed_to_resend_verification_code',
                    life: 5000,
                });
                this._otpVerificationResultState.set({
                    ...this._otpVerificationResultState(),
                    methodSelectionResponse: null,
                    success: false,
                    error,
                });
                return EMPTY;
            }),
            finalize(() => this.loadingResend.set(false))
        ).subscribe();
    }

    /**
     * Calls the login API after OTP verification
     */
    login(params: ILoginRequestDto): void {
        Logger.debug('🚀 Sending login request after OTP verification...');

        this.loadingLogin.set(true);
        this._otpVerificationResultState.set({ ...initialOtpVerificationResultState });

        this._apiClient.login(params).pipe(
            take(1),
            tap((response: ILoginResponseDto) => {
                if (response.status) {
                    Logger.info('✅ Login successful:', response);
                    this._storageService.setItem(StorageKeys.TOKEN, response.data.token, true);
                    this._storageService.setItem(StorageKeys.CURRENT_USER_INFO, response.data, true);

                    // Show mood modal after successful login
                    setTimeout(() => {
                        // this._moodModalIntegrationService.checkMoodModal();
                    }, 1000);

                    this._nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        loginResponse: response,
                        success: true,
                        error: null,
                    });
                } else {
                    const message = response?.message || 'فشل في تسجيل الدخول';
                    Logger.warn('⚠️ Login failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000,
                    });
                    this._otpVerificationResultState.set({
                        ...this._otpVerificationResultState(),
                        loginResponse: response,
                        success: false,
                        error: { message } as ApiError,
                    });
                    this._nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.LOGIN);
                }
            }),
            catchError((error: ApiError) => {
                Logger.error('❌ Login error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: error?.message || 'خطأ في الاتصال بالسيرفر',
                    life: 5000,
                });
                this._otpVerificationResultState.set({
                    ...this._otpVerificationResultState(),
                    loginResponse: null,
                    success: false,
                    error,
                });
                this._nav.navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.LOGIN);
                return EMPTY;
            }),
            finalize(() => this.loadingLogin.set(false))
        ).subscribe();
    }

    /**
     * Reset result state
     */
    reset(): void {
        this._otpVerificationResultState.set(initialOtpVerificationResultState);
        Logger.debug('🔄 OTP verification state reset.');
    }
}