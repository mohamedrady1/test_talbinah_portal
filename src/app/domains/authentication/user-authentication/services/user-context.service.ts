import { IGlobalUserContactInfoModel, Logger, StorageService, TransferStateService } from '../../../../common';
import { inject, Injectable, computed, effect, signal } from '@angular/core';
import { StorageKeys } from '../../../../shared';
import { IUserData } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  recallUserDataViewed = new BehaviorSubject<boolean>(false);

  // Refresh signal for user info and wallet reload
  private readonly refreshSubject = new BehaviorSubject<boolean>(false);
  readonly refresh$: Observable<boolean> = this.refreshSubject.asObservable();

  private readonly transferState = inject(TransferStateService);
  private readonly _StorageService = inject(StorageService);

  // SSR-safe init from TransferState (or Storage)
  private readonly _user = signal<IUserData | null>(
    this.transferState.get<IUserData>(StorageKeys.CURRENT_USER_INFO)
    ?? this._StorageService.getItem<IUserData>(StorageKeys.CURRENT_USER_INFO)
    ?? null
  );

  private readonly _token = signal<string | null>(
    this.transferState.get<string>(StorageKeys.TOKEN)
    ?? this._StorageService.getItem<string>(StorageKeys.TOKEN)
    ?? null
  );

  // Public signals
  readonly user = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    effect(() => {
      if (this._user()) {
        this._StorageService.setItem(StorageKeys.CURRENT_USER_INFO, this._user()!, true);
        this.transferState.set(StorageKeys.CURRENT_USER_INFO, this._user()!);
      } else {
        this._StorageService.removeItem(StorageKeys.CURRENT_USER_INFO);
        this.transferState.remove(StorageKeys.CURRENT_USER_INFO);
      }

      if (this._token()) {
        this._StorageService.setItem(StorageKeys.TOKEN, this._token()!, true);
        this.transferState.set(StorageKeys.TOKEN, this._token()!);
      } else {
        this._StorageService.removeItem(StorageKeys.TOKEN);
        this.transferState.remove(StorageKeys.TOKEN);
      }
    });
  }

  updateUserInfo(newUser?: IGlobalUserContactInfoModel): void {
    let loginUserDataString = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO);
    Logger.debug('NationalIdVerificationComponent closed => loginUserData raw string: ', loginUserDataString);

    if (loginUserDataString) {
      try {
        // Always parse the string into the IUserData type
        let loginUserData: IUserData | any = loginUserDataString;
        Logger.debug('NationalIdVerificationComponent closed => parsed loginUserData: ', loginUserData);

        if (loginUserData.user) {
          // Access the current user object
          let currentUser: IGlobalUserContactInfoModel = loginUserData.user;

          if (newUser) {
            loginUserData.user = { ...currentUser, ...newUser };
            Logger.debug('User data updated by spreading newUser:', loginUserData.user);
          } else {
            Logger.debug('User data updated with hardcoded values (newUser was not provided): ', currentUser);
          }


          // Convert the updated IUserData object back to a JSON string
          const updatedLoginUserDataString = loginUserData;
          this._StorageService.setItem(StorageKeys.CURRENT_USER_INFO, updatedLoginUserDataString, true);

          Logger.debug('Updated loginUserData stored in Storage: ', updatedLoginUserDataString);
          Logger.debug('Updated loginUserData _StorageService in Storage: ', this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO));

        } else {
          Logger.warn('No user object found in loginUserData.');
        }
      } catch (error) {
        Logger.error('Error parsing loginUserData from storage: ', error);
      }
    } else {
      Logger.warn('No user data found in Storage for key: ', StorageKeys.CURRENT_USER_INFO);
    }
  }

  /**
   * Sets user/token context after successful login, register, OTP, etc.
   */
  initializeFromAuth(response: any): void {
    this._user.set(response.user);
    this._token.set(response.token);
  }

  /**
   * Wipes all user-related info and auth token.
   */
  clear(): void {
    this._user.set(null);
    this._token.set(null);
    // Also clear community user profile data
    this._StorageService.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
  }

  emitRefresh(): void {
    Logger.debug('UserContextService: Emitting refresh signal');
    this.refreshSubject.next(true);
  }

  getRefreshState(): boolean {
    return this.refreshSubject.value;
  }
}
