import { IProgramme } from './programme.model';

export interface IProgrammeStoreState {
  isStoring: boolean;
  storeSuccess: boolean;
  storeError: string | null;
  storedProgrammeResponse: IProgramme | null; // Stores the 'data' part of the response
}

export const initialProgrammeStoreState: IProgrammeStoreState = {
  isStoring: false,
  storeSuccess: false,
  storeError: null,
  storedProgrammeResponse: null,
};
