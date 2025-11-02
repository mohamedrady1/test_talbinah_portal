// src/app/community/models/community-posts.models.ts

import { IPost } from '../dtos'; // Adjust path as necessary
import { IPaginationParameters } from '../../../common'; // Adjust path as necessary

/**
 * Represents the state of the posts list within the community feature.
 */
export interface CommunityPostsListState {
  response: IPost[]; // Array of posts for the current page
  pagination: IPaginationParameters; // Current pagination parameters
  isLoading: boolean;
  isFiltering: boolean; // Indicates if a filter (e.g., by interest) is active
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

/**
 * The top-level feature state for all community-related posts data.
 * This can be extended if other sub-domains within 'posts' need their own state slices.
 */
export interface CommunityPostsFeatureState {
  posts: CommunityPostsListState;
  // You could add other slices here if needed, e.g., singlePost: SinglePostState;
}

/**
 * Initial state for the posts list.
 */
export const initialCommunityPostsListState: CommunityPostsListState = {
  response: [],
  pagination: { page: 1, per_page: 5 }, // Default pagination
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

/**
 * Initial state for the entire community posts feature.
 */
export const initialCommunityPostsFeatureState: CommunityPostsFeatureState = {
  posts: initialCommunityPostsListState,
};
