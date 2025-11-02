import { IUserIdentifyProfileResponseDto, IUserIdentifyProfileData } from '../dtos';
import { inject, Injectable, signal, computed, PLATFORM_ID } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { StorageService, Logger, ApiError } from '../../../common';
import { TalbinahCommunityApiClientProvider } from '../clients';
import { isPlatformBrowser } from '@angular/common';
import { StorageKeys } from '../../../shared';

interface UserIdentityProfileState {
  response: IUserIdentifyProfileResponseDto | null;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: UserIdentityProfileState = {
  response: null,
  isLoading: false,
  errorMessage: ''
};

@Injectable({
  providedIn: 'root'
})
export class UserIdentityProfileFacade {
  private readonly _apiClient = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly _storageService = inject(StorageService);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _state = signal<UserIdentityProfileState>(initialState);

  // Public computed properties
  readonly userIdentityProfile = computed(() => this._state().response?.data || null);
  readonly isLoadingUserIdentity = computed(() => this._state().isLoading);
  readonly errorMessageUserIdentity = computed(() => this._state().errorMessage);
  readonly isUserIdentityProfile = computed(() => !!this.userIdentityProfile()?.id);

  fetchUserIdentifyProfile(): void {
    Logger.debug('UserIdentityProfileFacade | fetchUserIdentifyProfile | Start');
    this._updateState({
      isLoading: true,
      errorMessage: '🔄 Loading user identity profile... Please wait.'
    });

    this._apiClient.getUserIdentifyProfile().pipe(
      tap(response => this._handleSuccess(response)),
      catchError(error => this._handleError(error)),
      finalize(() => this._updateState({ isLoading: false }))
    ).subscribe();
  }

  updateProfileData(updatedData: IUserIdentifyProfileData): void {
    const updatedResponse: IUserIdentifyProfileResponseDto = {
      status: true,
      message: 'Updated locally',
      data: updatedData
    };

    this._updateState({ response: updatedResponse, errorMessage: '' });

    if (isPlatformBrowser(this._platformId)) {
      this._storageService.setItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA, updatedData, true);
    }
  }

  private _handleSuccess(response: IUserIdentifyProfileResponseDto): void {
    if (response?.data?.id) {
      this._updateState({ response, errorMessage: '' });
      if (isPlatformBrowser(this._platformId)) {
        this._storageService.setItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA, response.data, true);
      }
      Logger.debug('User identity profile fetched successfully:', response);
    } else {
      this._updateState({ response: null, errorMessage: '' });
      if (isPlatformBrowser(this._platformId)) {
        this._storageService.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
      }
      Logger.warn('No user identity profile data found or ID missing');
    }
  }

  private _handleError(error: ApiError): Observable<never> {
    this._updateState({
      isLoading: false,
      errorMessage: error?.message || '❌ Failed to fetch user identity profile.'
    });
    Logger.error('Failed to fetch user identity profile:', error);
    return EMPTY;
  }

  private _updateState(updates: Partial<UserIdentityProfileState>): void {
    this._state.update(state => ({ ...state, ...updates }));
  }

  /** Reset the entire user identity profile state */
  resetProfile(): void {
    // Reset the signal state
    this._updateState({ ...initialState });

    // Remove persisted storage
    if (isPlatformBrowser(this._platformId)) {
      this._storageService.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
    }

    Logger.debug('UserIdentityProfileFacade | Profile state has been reset');
  }
}
