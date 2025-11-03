import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { LocalizationService, ToastService } from '../../../../shared';
import { UserAuthenticationApiClientProvider } from '../clients';
import { IRegisterRequestDto, IRegisterResponseDto } from '../dtos';
import { ApiError, handleApiErrorsMessage, Logger } from '../../../../common';

interface RegisterResultState {
    response: IRegisterResponseDto | null;
    success: boolean;
    error: string | null;
    registerRequest: IRegisterRequestDto | null;
}

const initialRegisterResultState: RegisterResultState = {
    response: null,
    success: false,
    error: null,
    registerRequest: null
};

@Injectable({ providedIn: 'root' })
export class RegisterFacade {
    private readonly _apiClient = inject(UserAuthenticationApiClientProvider).getClient();
    private readonly _toastService = inject(ToastService);
    private readonly _localizationService = inject(LocalizationService);

    private readonly _state = signal<RegisterResultState>(initialRegisterResultState);
    readonly loading = signal(false);

    readonly response = computed(() => this._state().response);
    readonly success = computed(() => this._state().success);
    readonly error = computed(() => this._state().error);
    readonly registerRequest = computed(() => this._state().registerRequest);

    register(params: IRegisterRequestDto): void {
        Logger.debug('🚀 Sending register request...');
        this.loading.set(true);
        this._state.set({ ...initialRegisterResultState, registerRequest: params });

        this._apiClient.register(params).pipe(
            tap((response: IRegisterResponseDto) => {
                if (response?.status) {
                    Logger.info('✅ Register successful:', response);
                    this._state.set({ response, success: true, error: null, registerRequest: params });
                } else {
                    const message = 'Failed to register';
                    Logger.warn('⚠️ Register failed:', message);
                    this._toastService.add({
                        severity: 'error',
                        summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                        detail: message,
                        life: 5000
                    });
                    this._state.set({ response, success: false, error: message, registerRequest: params });
                }
            }),
            catchError((error: ApiError) => {
                const message = error?.message || 'Error connecting to server';
                Logger.error('❌ Register error:', error);
                handleApiErrorsMessage(error);
                this._toastService.add({
                    severity: 'error',
                    summary: this._localizationService.translateTextFromJson('an_error_has_occurred'),
                    detail: message,
                    life: 5000
                });
                this._state.set({ response: null, success: false, error: message, registerRequest: params });
                return EMPTY;
            }),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    reset(): void {
        this._state.set(initialRegisterResultState);
        Logger.debug('🔄 Register state reset.');
    }
}


