import { IPostsInterestsListingResponseDto } from '../dtos';

/**
 * Defines the state structure for post interests (categories).
 */
export interface PostInterestsState {
  interestsResponse: IPostsInterestsListingResponseDto | null; // Renamed from intrestsResponse for clarity
  isLoading: boolean;
  errorMessage: string;
}

/**
 * The initial, default state for post interests.
 */
export const initialPostInterestsState: PostInterestsState = {
  interestsResponse: null,
  isLoading: false,
  errorMessage: '',
};
