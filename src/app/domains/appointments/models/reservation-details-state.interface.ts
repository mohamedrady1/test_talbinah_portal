import { IGlobalReservationModel } from "./reservation-item.model";

export interface IReservationDetailsState {
  reservation: IGlobalReservationModel | null; // Holds the fetched IReservation object
  isLoading: boolean;
  errorMessage: string | null;
  status?: boolean; // Indicates the success/failure of the last fetch operation
}

export const initialReservationDetailsState: IReservationDetailsState = {
  reservation: null,
  isLoading: false,
  errorMessage: null,
  status: false // Default to false until a successful fetch
};
