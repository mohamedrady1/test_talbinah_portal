import { IGlobalReservationModel } from "../../models";

export interface INormalPackagesReservationResponseDto {
  message: string | null;
  status: boolean;
  data: IGlobalReservationModel | null; // Assuming IGlobalReservationModel is the type for reservation details
}
