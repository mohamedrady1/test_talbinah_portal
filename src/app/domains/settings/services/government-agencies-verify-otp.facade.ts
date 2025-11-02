// government-agencies-verify-otp.facade.ts

import {
  inject,
  Injectable,
  signal,
  computed
} from '@angular/core';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { SettingsApiClientProvider } from '../clients';

import { Logger, handleApiErrors } from '../../../common';
import { IGovernmentAgenciesVerifyOtpRequestDto, IGovernmentAgenciesVerifyOtpResponseDto } from '../dtos';

export interface GovernmentAgenciesVerifyOtpState {
  status: boolean | null;
  message: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  response: IGovernmentAgenciesVerifyOtpResponseDto | null;
}

const initialOtpState: GovernmentAgenciesVerifyOtpState = {
  status: null,
  message: null,
  isLoading: false,
  errorMessage: null,
  response: null
};

@Injectable({ providedIn: 'root' })
export class GovernmentAgenciesVerifyOtpFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _state = signal<GovernmentAgenciesVerifyOtpState>(initialOtpState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly status = computed(() => this._state().status);
  readonly message = computed(() => this._state().message);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly response = computed(() => this._state().response);

  verifyGovernmentAgenciesEmailOtp(payload: IGovernmentAgenciesVerifyOtpRequestDto): void {
    this._updateState({ isLoading: true, errorMessage: null });

    this._apiClient
      .verifyGovernmentAgenciesEmailOtp(payload)
      .pipe(
        tap((res: IGovernmentAgenciesVerifyOtpResponseDto) => {
          Logger.debug('✅ OTP Verification Response:', res);

          this._updateState({
            status: res.status,
            message: res.message ?? null,
            response: res
          });
        }),
        catchError((err) => {
          Logger.error('❌ OTP Verification Failed:', err);
          this._updateState({
            status: false,
            errorMessage: 'فشل التحقق من الرمز. حاول مرة أخرى.',
            response: null
          });
          handleApiErrors(err);
          return EMPTY;
        }),
        finalize(() => {
          this._updateState({ isLoading: false });
        })
      )
      .subscribe();
  }

  reset(): void {
    this._state.set(initialOtpState);
  }

  private _updateState(patch: Partial<GovernmentAgenciesVerifyOtpState>) {
    this._state.update(prev => ({
      ...prev,
      ...patch
    }));
  }

  private _encodeFormData(data: Record<string, any>): string {
    return Object.entries(data)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join('&');
  }
}
