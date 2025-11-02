import { IMyTherapeuticProgramsResponseDto, ITherapeuticProgramsListingResponseDto } from '../dtos';

/**
 * Represents the state for a list of therapeutic programs.
 * This can be reused for "all programs" and "my programs."
 */
export interface ProgramListState {
  response: ITherapeuticProgramsListingResponseDto | IMyTherapeuticProgramsResponseDto | null;
  isLoading: boolean;
  isFiltering: boolean; // For filter-specific loading
  errorMessage: string | null;
  status: boolean | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Defines the overall state for the Therapeutic Programs feature.
 * This can grow to include other sub-states if the feature becomes more complex.
 */
export interface TherapeuticProgramsFeatureState {
  allPrograms: ProgramListState;
  myPrograms: ProgramListState; // New state for 'My Therapeutic Programs'
  // Add other feature-level states here if needed (e.g., selectedProgramDetails)
}

// Initial state for a program list
export const initialProgramListState: ProgramListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  status: false,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

// Initial state for the entire feature
export const initialTherapeuticProgramsFeatureState: TherapeuticProgramsFeatureState = {
  allPrograms: { ...initialProgramListState },
  myPrograms: { ...initialProgramListState },
};
