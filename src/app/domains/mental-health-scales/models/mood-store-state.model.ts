import { IStoreUserMoodResponseDto } from "../dtos";

export interface MoodStoreState {
  isStoring: boolean;
  storeSuccess: boolean;
  storeError: string | null;
  storedMoodResponse: IStoreUserMoodResponseDto | null;
}

export const initialMoodStoreState: MoodStoreState = {
  isStoring: false,
  storeSuccess: false,
  storeError: null,
  storedMoodResponse: null,
};
