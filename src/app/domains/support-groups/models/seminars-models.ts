import { IPaginationParameters, defaultPaginationParameters } from '../../../common';
import { ISeminarsListingResponseDto, IMySeminarsResponseDto } from '../dtos';

/**
 * Represents the state for a single list of seminars (e.g., all seminars, my seminars).
 */
export interface SeminarsListState {
  response: ISeminarsListingResponseDto | IMySeminarsResponseDto | null; // Can hold either response type
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  status: boolean | null; // Indicates if the last fetch was successful (true) or failed (false)
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pagination: IPaginationParameters; // The pagination parameters used for the current state
}

/**
 * Initial state for a single seminar list.
 */
export const initialSeminarsListState: SeminarsListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  status: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  pagination: { ...defaultPaginationParameters }
};

/**
 * Represents the overall feature state for Seminars.
 */
export interface SeminarsFeatureState {
  allSeminars: SeminarsListState;
  myPrograms: SeminarsListState; // Keeping 'myPrograms' as per your facade, consider renaming to 'mySeminars'
}

/**
 * Initial state for the entire Seminars feature.
 */
export const initialSeminarsFeatureState: SeminarsFeatureState = {
  allSeminars: { ...initialSeminarsListState },
  myPrograms: { ...initialSeminarsListState } // Keeping 'myPrograms' as per your facade, consider renaming to 'mySeminars'
};
