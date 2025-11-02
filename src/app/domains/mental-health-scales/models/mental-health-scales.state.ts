import { IMentalHealthScaleListItemDto } from '../dtos'; // <-- Keep this import
import { IPaginationParameters, defaultPaginationParameters } from '../../../common'; // <-- Import pagination types

export interface MentalHealthScalesListState {
  response: IMentalHealthScaleListItemDto[];
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  // --- Pagination Properties Added ---
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pagination: IPaginationParameters; // <-- New: Holds the current pagination parameters
}

export interface MentalHealthScalesFeatureState {
  scales: MentalHealthScalesListState;
}

export const initialMentalHealthScalesListState: MentalHealthScalesListState = {
  response: [],
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  // --- Initial Pagination Values ---
  totalItems: 0,
  currentPage: 1,
  totalPages: 1, // Start with at least 1 page
  pagination: { ...defaultPaginationParameters, page: 1, per_page: 10 }, // <-- Initialize with default params
};

export const initialMentalHealthScalesFeatureState: MentalHealthScalesFeatureState = {
  scales: initialMentalHealthScalesListState
};