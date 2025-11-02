import { IPaymentMethod } from "../../appointments";

// Define or import IPaymentSummaryReservations interface
export interface IPaymentSummaryReservations {
  // Add properties as needed
}

export interface IPaymentSummary {
  paymentType: IPaymentMethod | null;
  reservationsSummary: any | null;
  // reservationsSummary: IPaymentSummaryReservations | null;
  item: any;
}
