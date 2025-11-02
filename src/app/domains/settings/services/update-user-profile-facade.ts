import { inject, Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { ToastService, LocalizationService, StorageKeys } from '../../../shared';
import { Logger, ApiError, handleApiErrors, IGlobalUserContactInfoModel } from '../../../common';
import { ISettingsApiClient, SettingsApiClientProvider } from '../clients';
import { UpdateProfileApiResponse } from '../dtos';
import { UserContextService } from '../../authentication';
import { isPlatformBrowser } from '@angular/common';

interface UpdateProfileResultState {
  response: UpdateProfileApiResponse | null;
  success: boolean;
  error: string | null;
}

const initialUpdateProfileResultState: UpdateProfileResultState = {
  response: null,
  success: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class UpdateUserProfileFacade {
  private readonly _apiClient: ISettingsApiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);

  private readonly _UserContextService = inject(UserContextService);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _localizationService = inject(LocalizationService);

  // === STATE ===
  private readonly _updateResultState = signal<UpdateProfileResultState>(initialUpdateProfileResultState);
  readonly loading = signal(false);

  // === COMPUTED SELECTORS ===
  readonly response = computed(() => this._updateResultState().response);
  readonly success = computed(() => this._updateResultState().success);
  readonly error = computed(() => this._updateResultState().error);

  /**
   * Calls the update profile API
   */
  updateProfile(formData: FormData): void {
    Logger.debug('🚀 Sending profile update request...');

    this.loading.set(true);
    this._updateResultState.set(initialUpdateProfileResultState);

    this._apiClient.updateProfile(formData).pipe(
      tap((response: UpdateProfileApiResponse) => {
        if (response?.status) {
          Logger.info('✅ Profile updated successfully:', response);

          this._toastService.add({
            severity: 'success',
            summary: this._localizationService.translateTextFromJson('general.success'),
            detail: response.message || 'تم تحديث البيانات بنجاح',
            life: 4000,
          });

          let storedUserData: { token: string, user: IGlobalUserContactInfoModel } = JSON.parse(this.getStoredUser() || '{}');
          Logger.debug('UpdateUserProfileFacade | updateProfileFn | Stored User: ', storedUserData);
          if (response?.data) {
            let newUserData: { token: string, user: IGlobalUserContactInfoModel } = {
              token: storedUserData?.token,
              user: response?.data
            };
            this.setNewStoredUser(newUserData);
            Logger.debug('UpdateUserProfileFacade | updateProfileFn | New User: ', newUserData);
            this._UserContextService.recallUserDataViewed.next(true);
          }

          this._updateResultState.set({
            response,
            success: true,
            error: null,
          });
        } else {
          const message = response?.message || 'فشل في تحديث البيانات';

          Logger.warn('⚠️ Profile update failed:', message);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: message,
            life: 4000,
          });

          this._updateResultState.set({
            response,
            success: false,
            error: message,
          });
        }
      }),
      catchError((error: ApiError) => {
        const message = error?.message || 'خطأ في الاتصال بالسيرفر';

        Logger.error('❌ Profile update error:', error);
        handleApiErrors(error);

        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('general.error'),
          detail: message,
          life: 4000,
        });

        this._updateResultState.set({
          response: null,
          success: false,
          error: message,
        });

        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }


  /**
   * Reset result state (optional: after dismissing UI alerts)
   */
  reset(): void {
    this._updateResultState.set(initialUpdateProfileResultState);
    Logger.debug('🔄 Update profile state reset.');
  }

  private getStoredUser(): string | null {
    if (!isPlatformBrowser(this._platformId)) return null;
    try {
      return localStorage.getItem(StorageKeys.CURRENT_USER_INFO);
    } catch {
      return null;
    }
  }
  private setNewStoredUser(user: { token: string, user: IGlobalUserContactInfoModel }): void {
    if (!isPlatformBrowser(this._platformId)) return;
    user ? localStorage.setItem(StorageKeys.CURRENT_USER_INFO, JSON.stringify(user)) : '';
  }
}
