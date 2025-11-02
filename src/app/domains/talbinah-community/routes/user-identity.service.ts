import { Injectable, computed, signal, inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { IUserIdentifyProfileResponseDto, IUserIdentifyProfileData } from '../dtos'; // Assuming IUserIdentifyProfileData is also defined
import { TalbinahCommunityApiClientProvider } from '../clients'; // Use Provider to get client
import { Logger } from '../../../common'; // Assuming Logger is available
import { StorageService } from '../../../common';
import { StorageKeys } from '../../../shared';

@Injectable({ providedIn: 'root' })
export class UserIdentityStore {
  // Use TalbinahCommunityApiClientProvider to get the client instance
  private readonly api = inject(TalbinahCommunityApiClientProvider).getClient();
  private readonly storage = inject(StorageService);

  // Internal signals
  private readonly _profile = signal<IUserIdentifyProfileData | null>(null); // Now stores only the data part
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Expose signals as computed for read-only access
  readonly profile = computed(() => this._profile());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  // Computed signal to indicate if a profile has been successfully loaded
  readonly isProfileLoaded = computed(() => !!this._profile()); // True if profile data is not null

  constructor() { }

  /**
   * Fetches the user's identity profile from the API.
   */
  fetch(): void {
    this._isLoading.set(true);
    this._error.set(null); // Clear previous errors

    this.api.getUserIdentifyProfile().pipe(
      tap((res: IUserIdentifyProfileResponseDto) => {
        if (res.status && res.data) {
          this._profile.set(res.data); // Set only the data part to the signal
          Logger.debug('UserIdentityStore: Profile fetched successfully:', res.data);
        } else {
          this._profile.set(null); // Clear profile if status is false or no data
          this._error.set(res.message || 'No user profile found.');
          Logger.warn('UserIdentityStore: No user profile found or invalid response:', res);
        }
      }),
      catchError((err) => {
        const errorMessage = typeof err.message === 'string' ? err.message : '⚠️ Failed to load profile.';
        this._error.set(errorMessage);
        this._profile.set(null); // Ensure profile is null on error
        Logger.error('UserIdentityStore: Error fetching profile:', err);
        return EMPTY; // Prevent re-throwing the error
      }),
      finalize(() => this._isLoading.set(false))
    ).subscribe();
  }

  /**
   * Updates the profile data in the store after a successful update operation.
   * This is called by components that modify the user's profile.
   * @param newProfileData The updated user identity profile data.
   */
  updateProfileData(newProfileData: IUserIdentifyProfileData): void {
    this._profile.set(newProfileData);
    // Clear any previous errors or loading states if an update was successful
    this._error.set(null);
    this._isLoading.set(false);
    Logger.debug('UserIdentityStore: Profile data updated internally:', newProfileData);
  }

  /**
   * Clears the user profile data from the store.
   */
  clear(): void {
    this._profile.set(null);
    this._error.set(null);
    this._isLoading.set(false);
    // Also clear from localStorage
    this.storage.removeItem(StorageKeys.MY_COMMUNITY_USER_PROFILE_DATA);
    Logger.debug('UserIdentityStore: Profile data cleared from store and localStorage.');
  }
}
