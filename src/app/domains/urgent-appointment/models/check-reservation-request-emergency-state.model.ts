import { IReservationDetailsDto } from "../dtos";

export interface ICheckReservationEmergencyState {
  isStoring: boolean;
  storeSuccess: boolean;
  before_request?: boolean;
  storeError: string | null;
  storedCheckReservationResponse: IReservationDetailsDto | any | null; // Stores the 'data' part of the response
}

export const initialCheckReservationEmergencyState: ICheckReservationEmergencyState = {
  isStoring: false,
  storeSuccess: false,
  before_request: false,
  storeError: null,
  storedCheckReservationResponse: null,
};
