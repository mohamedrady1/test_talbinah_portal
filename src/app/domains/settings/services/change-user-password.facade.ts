import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  computed
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { Logger, handleApiErrors } from '../../../common';
import { SettingsApiClientProvider } from '../clients';
import {
  IChangePasswordRequestDto,
  IChangePasswordResponseDto
} from '../dtos';

interface IChangePasswordState {
  isLoading: boolean;
  errorMessage: string | null;
  success: boolean;
  response: IChangePasswordResponseDto['data'] | null;
  successMessage: string | null;
}

const initialChangePasswordState: IChangePasswordState = {
  isLoading: false,
  errorMessage: null,
  success: false,
  response: null,
  successMessage: null
};

@Injectable({ providedIn: 'root' })
export class ChangeUserPasswordFacade {
  private readonly _client = inject(SettingsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _state = signal<IChangePasswordState>({ ...initialChangePasswordState });

  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly success = computed(() => this._state().success);
  readonly response = computed(() => this._state().response);
  readonly successMessage = computed(() => this._state().successMessage);

  /**
   * Request to change user password.
   */
  changePassword(payload: IChangePasswordRequestDto): void {
    if (!isPlatformBrowser(this._platformId)) return;

    // Validate password confirmation
    if (payload.new_password !== payload.confirmation_new_password) {
      this._updateState({
        success: false,
        errorMessage: 'كلمة المرور الجديدة وتأكيدها غير متطابقين'
      });
      return;
    }

    // Validate old password is not the same as new password
    if (payload.old_password === payload.new_password) {
      this._updateState({
        success: false,
        errorMessage: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية'
      });
      return;
    }

    this._updateState({ isLoading: true, errorMessage: null, success: false });

    this._client
      .changeUserPassword(payload)
      .pipe(
        tap((res: IChangePasswordResponseDto) => {
          this._updateState({
            success: true,
            response: res.data ?? null,
            errorMessage: null,
            successMessage: res.message ?? 'تمت العملية بنجاح'
          });

        }),
        catchError((err) => {
          Logger.error('[ChangeUserPasswordFacade] Failed to change password', err);
          this._updateState({
            success: false,
            errorMessage: err.message ?? 'حدث خطأ أثناء تغيير كلمة المرور'
          });
          handleApiErrors(err);
          return EMPTY;
        }),
        finalize(() => this._updateState({ isLoading: false }))
      )
      .subscribe();
  }

  /**
   * Reset facade state to initial.
   */
  resetState(): void {
    this._state.set({ ...initialChangePasswordState });
  }

  /**
   * Safely updates partial state.
   */
  private _updateState(updates: Partial<IChangePasswordState>) {
    this._state.update((prev) => ({ ...prev, ...updates }));
  }
}
