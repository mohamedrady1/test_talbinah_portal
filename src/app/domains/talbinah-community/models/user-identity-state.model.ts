import { IUserIdentifyProfileData } from '../dtos';

/**
 * Defines the state structure for the user identity profile.
 */
export interface UserIdentityState {
  data: IUserIdentifyProfileData | null;
  isLoading: boolean;
  errorMessage: string;
  isProfileLoaded: boolean; // Indicates if a profile has been successfully loaded
}

/**
 * The initial, default state for user identity.
 */
export const initialUserIdentityState: UserIdentityState = {
  data: null,
  isLoading: false,
  errorMessage: '',
  isProfileLoaded: false,
};
