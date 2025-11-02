import { ISeminarItemDto } from "../dtos";

export interface ISeminarStoreState {
  isStoring: boolean;
  storeSuccess: boolean;
  storeError: string | null;
  storedSeminarResponse: ISeminarItemDto | null; // Stores the 'data' part of the response
}

export const initialSeminarStoreState: ISeminarStoreState = {
  isStoring: false,
  storeSuccess: false,
  storeError: null,
  storedSeminarResponse: null,
};
