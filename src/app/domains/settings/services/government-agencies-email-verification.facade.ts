// government-agencies-email-verification.facade.ts

import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, finalize, tap, EMPTY, of } from 'rxjs';

import { SettingsApiClientProvider } from '../clients';
import { Logger, handleApiErrors } from '../../../common';
import { ISendVerificationEmailRequest, ISendVerificationEmailResponse } from '../dtos';

export interface GovernmentAgenciesEmailVerificationState {
  status: boolean | null;
  message: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: GovernmentAgenciesEmailVerificationState = {
  status: null,
  message: null,
  isLoading: false,
  errorMessage: null
};

@Injectable({ providedIn: 'root' })
export class GovernmentAgenciesEmailVerificationFacade {
  private readonly _apiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _state = signal<GovernmentAgenciesEmailVerificationState>(initialState);

  readonly status = computed(() => this._state().status);
  readonly message = computed(() => this._state().message);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);

  sendGovernmentAgenciesEmailVerification(email: string): void {
    this._updateState({ isLoading: true, errorMessage: null });

    const payload: ISendVerificationEmailRequest = { work_email: email };

    this._apiClient.sendGovernmentAgenciesEmailVerification(payload)
      .pipe(
        tap((res: ISendVerificationEmailResponse) => {
          Logger.debug('✅ Email verification response:', res);
          this._updateState({
            status: res.status,
            message: res.message,
            isLoading: false
          });
        }),
        catchError(err => {
          Logger.error('🚨 Email verification error:', err);
          this._updateState({
            status: false,
            isLoading: false,
            errorMessage: 'فشل ارسال البريد الالكتروني. حاول مرة أخرى.'
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

  clear(): void {
    this._state.set(initialState);
  }

  private _updateState(patch: Partial<GovernmentAgenciesEmailVerificationState>): void {
    this._state.update(current => ({
      ...current,
      ...patch
    }));
  }
}
