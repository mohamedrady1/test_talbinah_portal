// src/app/reservations/models/reservations-list-states.model.ts

import { IReservationsListingResponseDto } from '../dtos';
import { IGlobalReservationModel } from './reservation-item.model';

/**
 * Interface representing the state for the ReservationsListFacade.
 * This holds all the data and loading/error indicators for the appointments listing.
 */
export interface IReservationsListState {
  appointmentsResponse: IReservationsListingResponseDto | null;
  reservationsList: IGlobalReservationModel[] | null;
  isLoading: boolean;
  isLoadingFilter: boolean;
  errorMessage: string;
  totalItems: number;
  status: boolean | null; // Added: true for success, false for API reported error, null initially/no specific status
}

/**
 * Initial state object for IReservationsListState.
 * Provides default values when the state is first initialized.
 */
export const initialReservationsListState: IReservationsListState = {
  appointmentsResponse: null,
  reservationsList: null,
  isLoading: false,
  isLoadingFilter: false,
  errorMessage: '',
  totalItems: 0,
  status: null // Added: Initialize to null
};
