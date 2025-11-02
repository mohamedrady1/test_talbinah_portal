import { ICountriesResponseDto } from '../dtos';

export interface CountriesLookupState {
  response: ICountriesResponseDto | null; // Holds the full API response
  isLoading: boolean;
  status: boolean | null; // True for success, false for error, null for initial/pending
  errorMessage: string | null;
}

export const initialCountriesLookupState: CountriesLookupState = {
  response: null,
  isLoading: false,
  status: null,
  errorMessage: null,
};
