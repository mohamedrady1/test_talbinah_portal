import { ICreateMentalHealthScaleResponseDto } from "../dtos";

export interface CreateMentalHealthScaleState {
  isCreating: boolean;
  createSuccess: boolean;
  createError: string | null;
  createdScaleResponse: ICreateMentalHealthScaleResponseDto | null;
}

export const initialCreateMentalHealthScaleState: CreateMentalHealthScaleState = {
  isCreating: false,
  createSuccess: false,
  createError: null,
  createdScaleResponse: null,
};
