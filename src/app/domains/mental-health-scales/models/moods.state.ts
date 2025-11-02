import { IMoodsListingResponseDto } from "../dtos";

/**
 * Represents the state for the moods listing.
 */
export interface MoodsListState {
  response: IMoodsListingResponseDto | null;
  isLoading: boolean;
  isFiltering: boolean; // If you have filters for moods
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

// Initial state for the moods list
export const initialMoodsListState: MoodsListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};
