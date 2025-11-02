import { ICommunicationsResponseDto } from '../dtos';

export interface CommunicationsLookupState {
  response: ICommunicationsResponseDto | null; // Holds the full API response
  isLoading: boolean;
  status: boolean | null; // True for success, false for error, null for initial/pending
  errorMessage: string | null;
}

export const initialCommunicationsLookupState: CommunicationsLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};
