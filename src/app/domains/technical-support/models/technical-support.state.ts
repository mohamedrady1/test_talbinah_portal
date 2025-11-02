
export interface ProgramListState {

}

export interface TechnicalSupportFeatureState {

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
export const initialTechnicalSupportFeatureState: TechnicalSupportFeatureState = {
  allPrograms: { ...initialProgramListState },
  myPrograms: { ...initialProgramListState },
};
