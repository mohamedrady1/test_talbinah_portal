import { IGlobalUserContactInfoModel, Logger, handleApiErrors } from '../../../common';
import { initialPreferredMsgChannelState, PreferredMsgChannelState } from '../models';
import { inject, Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { LocalizationService, StorageKeys } from '../../../shared';
import { NotificationsApiClientProvider } from '../clients';
import { IPreferredMsgChannelResponseDto } from '../dtos';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PreferredMsgChannelFacade {
  private readonly _apiClient = inject(NotificationsApiClientProvider).getClient();
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _localizationService = inject(LocalizationService);

  private readonly _state = signal<PreferredMsgChannelState>(initialPreferredMsgChannelState);

  // Computed state selectors
  readonly response = computed(() => this._state().response);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);

  /**
   * Update preferred message channel
   */
  updatePreferredMsgChannel(channel: 'both' | 'whatsapp' | 'sms' | null): void {
    Logger.debug(`Updating preferred message channel to: ${channel}`);

    this._state.update(s => ({
      ...s,
      isLoading: true,
      errorMessage: null
    }));

    this._apiClient
      .updatePreferredMsgChannel({ preferred_msg_channel: channel })
      .pipe(
        tap((response: IPreferredMsgChannelResponseDto) => {
          this._state.update(s => ({
            ...s,
            response,
            state: true
          }));

          // ✅ Retrieve the current stored user
          const currentUserData: { token: string; user?: IGlobalUserContactInfoModel } =
            JSON.parse(this.getStoredUser() || '{}');

          Logger.debug('PreferredMsgChannelFacade | Current User Data: ', currentUserData);

          // ✅ Update preferred_msg_channel in local storage
          if (currentUserData?.user) {
            currentUserData.user.preferred_msg_channel =
              channel ?? undefined; // converts null → undefined
            this.setNewStoredUser(currentUserData as { token: string; user: IGlobalUserContactInfoModel });
          }
        }),
        catchError((error) => {
          Logger.error('Error updating preferred message channel:', error);
          handleApiErrors(error);
          this._state.update(s => ({
            ...s,
            errorMessage: this._localizationService.translateTextFromJson('settings.errorUpdatingChannel'),
            state: false
          }));
          return EMPTY;
        }),
        finalize(() => {
          this._state.update(s => ({
            ...s,
            isLoading: false
          }));
        })
      )
      .subscribe();
  }

  resetPreferredMsgChannel(): void {
    Logger.debug('PreferredMsgChannelFacade | Resetting preferred message channel');

    // Reset the reactive state to the initial one
    this._state.set(initialPreferredMsgChannelState);
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
