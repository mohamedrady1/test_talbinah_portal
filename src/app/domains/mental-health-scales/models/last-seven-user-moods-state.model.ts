import { ILastSevenUserMoodsResponseDto } from "../dtos";

export interface LastSevenUserMoodsState {
  response: ILastSevenUserMoodsResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export const initialLastSevenUserMoodsState: LastSevenUserMoodsState = {
  response: null,
  isLoading: false,
  errorMessage: null,
};
