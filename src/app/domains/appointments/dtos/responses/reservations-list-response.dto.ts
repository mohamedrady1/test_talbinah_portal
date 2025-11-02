// src/app/reservations/dtos/reservations-listing-response.dto.ts
// (Assuming this is the path to your DTO)

import { IGlobalReservationModel } from "../../models"; // Make sure the path is correct

export interface IReservationsListingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    reservations: {
      data: IGlobalReservationModel[]; // Array of IGlobalReservationModel objects
      links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
      meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
          url: string | null;
          label: string;
          active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
      };
    };
    upcoming_count: number;
    ending_count: number;
    current_count: number;
    canceled_count: number;
  };
}
