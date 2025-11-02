import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { ToastService, LocalizationService } from '../../../shared';
import { ApiError, Logger } from '../../../common';
import { SettingsApiClientProvider } from '../clients';
import { IChargeWalletResponseDto } from '../dtos'; // make sure it's imported

interface ChargeWalletState {
  isLoading: boolean;
  errorMessage: string | null;
  isSuccess: boolean;
  response: IChargeWalletResponseDto | null;
}

@Injectable({ providedIn: 'root' })
export class ChargeWalletFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _localization = inject(LocalizationService);

  private readonly state = signal<ChargeWalletState>({
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
    response: null
  });

  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly isSuccess = computed(() => this.state().isSuccess);
  readonly response = computed(() => this.state().response); // ✅ expose response

  chargeWallet(amount: number): void {
    this.updateState({ isLoading: true, errorMessage: null, isSuccess: false });

    this._client.chargeWallet({ amount })
      .pipe(
        tap((res: IChargeWalletResponseDto) => {
          // this._toast.add({
          //   severity: 'success',
          //   summary: this._localization.translateTextFromJson('general.success'),
          //   detail: this._localization.translateTextFromJson('wallet.chargeSuccess'),
          //   life: 3000
          // });

          this.updateState({
            isSuccess: true,
            response: res // ✅ store response
          });
        }),
        catchError((err: ApiError) => {
          Logger.error('Charge wallet failed', err);
          const message = this._localization.translateTextFromJson('wallet.chargeFailed');
          this._toast.add({
            severity: 'error',
            summary: this._localization.translateTextFromJson('general.error'),
            detail: message,
            life: 5000
          });
          this.updateState({ errorMessage: message });
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  private updateState(update: Partial<ChargeWalletState>) {
    this.state.update(state => ({ ...state, ...update }));
  }
}
