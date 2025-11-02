import { ICancelEmergencyAppointmentResponseDto } from '../dtos';

export interface ICancelEmergencyAppointmentState {
  isCancelling: boolean;
  cancelSuccess: boolean;
  cancelError: string | null;
  cancelledAppointmentResponse: ICancelEmergencyAppointmentResponseDto['data'] | null;
}

export const initialCancelEmergencyAppointmentState: ICancelEmergencyAppointmentState = {
  isCancelling: false,
  cancelSuccess: false,
  cancelError: null,
  cancelledAppointmentResponse: null,
};
