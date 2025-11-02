import { ISpecialitiesResponseDto } from '../dtos';

export interface SpecialitiesLookupState {
  response: ISpecialitiesResponseDto | null; // Holds the full API response
  isLoading: boolean;
  status: boolean | null; // True for success, false for error, null for initial/pending
  errorMessage: string | null;
}

export const initialSpecialitiesLookupState: SpecialitiesLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};
