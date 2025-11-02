import { IMentalHealthScaleListItemDto } from "../dtos";
import { IPaginationParameters, defaultPaginationParameters } from '../../../common'; // <-- Import pagination types

export interface MyMeasurementsListState {
  measurements: IMentalHealthScaleListItemDto[];
  isLoading: boolean;
  errorMessage: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  // --- Pagination Properties Added ---
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pagination: IPaginationParameters; // <-- New: Holds the current pagination parameters
}

export const initialMyMeasurementsListState: MyMeasurementsListState = {
  measurements: [],
  isLoading: false,
  errorMessage: null,
  status: 'idle',
  // --- Initial Pagination Values ---
  totalItems: 0,
  currentPage: 1,
  totalPages: 1, // Start with at least 1 page
  pagination: { ...defaultPaginationParameters, page: 1, per_page: 10 }, // <-- Initialize with default params
};