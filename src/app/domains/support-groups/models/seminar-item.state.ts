import { ISeminarItemResponseDto } from '../dtos';

/**
 * Represents the state for a single therapeutic program's details.
 */
export interface SeminarItemState {
  item: ISeminarItemResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
}

// Initial state for a program item
export const initialSeminarItemState: SeminarItemState = {
  item: null,
  isLoading: false,
  errorMessage: null,
};
