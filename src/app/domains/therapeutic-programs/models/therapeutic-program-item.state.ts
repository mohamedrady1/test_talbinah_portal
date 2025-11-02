import { ITherapeuticProgramItemResponseDto } from '../dtos';

/**
 * Represents the state for a single therapeutic program's details.
 */
export interface ProgramItemState {
  item: ITherapeuticProgramItemResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean | null;
}

// Initial state for a program item
export const initialProgramItemState: ProgramItemState = {
  item: null,
  isLoading: false,
  errorMessage: null,
  status: null,
};
