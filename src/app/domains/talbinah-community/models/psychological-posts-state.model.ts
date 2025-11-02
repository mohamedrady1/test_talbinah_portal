import { IAllPostsResponseDto, IPost } from '../dtos';

/**
 * Defines the state structure for psychological posts.
 */
export interface PsychologicalPostsState {
  allPostsResponse: IAllPostsResponseDto | null;
  isLoading: boolean; // For initial full page load
  isLoadingFilter: boolean; // For tab/filter changes (replaces existing posts)
  isLoadingMore: boolean; // For "load more" (appends posts)
  errorMessage: string;
  totalItems: number;
  status: boolean; // Indicates success or failure of post fetch
}

/**
 * The initial, default state for psychological posts.
 */
export const initialPsychologicalPostsState: PsychologicalPostsState = {
  allPostsResponse: null,
  isLoading: false,
  isLoadingFilter: false,
  isLoadingMore: false,
  errorMessage: '',
  totalItems: 0,
  status: false, // Initial status set to false as nothing is loaded yet
};
