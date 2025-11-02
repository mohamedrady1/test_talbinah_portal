import { IGlobalDoctorContactInfoModel } from "./global-doctor-contact-info.model";
import { IGlobalReservationModel } from "../../../../domains/appointments/models";
import { IGlobalUserContactInfoModel } from "../user";

export interface IGlobalDoctorReviewModel {
  id: number;
  rating: number; // e.g., 5
  description: string;
  date: string; // ISO 8601 string (e.g., "2023-12-05T03:53:59.000000Z")

  user: IGlobalUserContactInfoModel | null;

  doctor: IGlobalDoctorContactInfoModel | null; // Placeholder until doctor shape is known
  reservation: IGlobalReservationModel | null; // Placeholder until reservation shape is known
}
