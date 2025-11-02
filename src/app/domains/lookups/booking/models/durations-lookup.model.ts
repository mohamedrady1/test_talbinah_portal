import { IDurationsResponseDto } from '../dtos';

export interface DurationsLookupState {
  response: IDurationsResponseDto | null; // Holds the full API response
  isLoading: boolean;
  status: boolean | null; // True for success, false for error, null for initial/pending
  errorMessage: string | null;
}

export const initialDurationsLookupState: DurationsLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};
