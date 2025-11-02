import { IEmergencyAppointmentItemDto } from "../dtos";

export interface IEmergencyAppointmentStoreState {
  isStoring: boolean;
  storeSuccess: boolean;
  storeError: string | null;
  storedEmergencyAppointmentResponse: IEmergencyAppointmentItemDto | null; // Stores the 'data' part of the response
}

export const initialEmergencyAppointmentStoreState: IEmergencyAppointmentStoreState = {
  isStoring: false,
  storeSuccess: false,
  storeError: null,
  storedEmergencyAppointmentResponse: null,
};
