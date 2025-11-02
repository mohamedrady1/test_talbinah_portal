import { IEmergencyDurationsPriceResponseDto } from '../dtos';

export interface EmergencyDurationsPriceLookupState {
  response: IEmergencyDurationsPriceResponseDto | null; // Holds the full API response
  isLoading: boolean;
  status: boolean | null; // True for success, false for error, null for initial/pending
  errorMessage: string | null;
}

export const initialEmergencyDurationsPriceLookupState: EmergencyDurationsPriceLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};
