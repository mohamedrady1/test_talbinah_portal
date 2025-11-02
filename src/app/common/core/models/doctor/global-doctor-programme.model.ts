import { IGlobalDoctorContactInfoModel } from "./global-doctor-contact-info.model";

export interface IGlobalDoctorProgrammeModel {
  id: number;
  programme_id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  original_price: number;
  programme_period: number; // In days or minutes?
  active: number; // Usually 1 or 0
  image: string;
  url: string | null;
  usage_number: number;
  reminder_seats: number;
  phases_count: number;
  sessions_count: number;
  is_purchased: boolean;
  progress: number; // e.g., percentage (0–100) or session index
  seats_label?: string | null;

  phases: any[] | null;   // Replace `any[]` with actual phase model if known
  doctor: IGlobalDoctorContactInfoModel | null;     // Replace `any` with IGlobalDoctorModel or similar if available
}
