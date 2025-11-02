import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  computed
} from '@angular/core';
import { Logger, handleApiErrors } from '../../../common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { SettingsApiClientProvider } from '../clients';
import {
  IWalletPointsToCouponRequestDto,
  IWalletPointsToCouponResponseDto
} from '../dtos';

interface IWalletPointsToCouponState {
  isLoading: boolean;
  errorMessage: string | null;
  success: boolean;
  response: any | null;
}

const initialCouponState: IWalletPointsToCouponState = {
  isLoading: false,
  errorMessage: null,
  success: false,
  response: null
};

@Injectable({ providedIn: 'root' })
export class WalletPointsToCouponFacade {

  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IWalletPointsToCouponState>(initialCouponState);

  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly success = computed(() => this._state().success);
  readonly response = computed(() => this._state().response);

  convertPointsToCoupon(points: number): void {
    // Validate points parameter
    if (points === undefined || points === null || points <= 0) {
      this._updateState({
        isLoading: false,
        errorMessage: 'عدد النقاط غير صحيح',
        success: false
      });
      return;
    }

    this._updateState({ isLoading: true, errorMessage: null, success: false });

    const payload: IWalletPointsToCouponRequestDto = { points: points };

    // Log payload for debugging
    Logger.debug('[WalletPointsToCouponFacade] Sending payload:', payload);

    this._client
      .getWalletPointsToCoupon(payload)
      .pipe(
        tap((res: IWalletPointsToCouponResponseDto) => {
          if (res.status) {
            this._updateState({
              success: true,
              response: res.data,
              errorMessage: null
            });
          } else {
            this._updateState({
              success: false,
              errorMessage: res.message ?? 'تعذر تحويل النقاط إلى قسيمة'
            });
          }
        }),
        catchError((err) => {
          Logger.error('[WalletPointsToCouponFacade] Failed to convert', err);
          this._updateState({
            success: false,
            errorMessage: 'حدث خطأ أثناء تحويل النقاط إلى قسيمة'
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

  resetState(): void {
    this._state.set(initialCouponState);
  }

  private _updateState(updates: Partial<IWalletPointsToCouponState>) {
    this._state.update((prev) => ({
      ...prev,
      ...updates
    }));
  }
}
