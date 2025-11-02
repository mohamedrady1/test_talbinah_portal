import { IDoctorItem } from "../../../shared";

export interface IProgramme {
  id: number;
  programme_id: number;
  price: number;
  discount: number;
  original_price: number;
  title: string;
  description: string;
  programme_period: number;
  active: number;
  image: string;
  url: string; // The checkout URL
  start_at: string; // e.g., "2025-06-14"
  end_at: string; // e.g., "2025-09-12"
  is_end: number; // Assuming 0 or 1 for boolean
  progress: number;
  phases_count: number;
  is_purchased: boolean;
  usage_number: number;
  reminder_seats: number;
  sessions_count: number;
  phases: any | null; // Define a more specific interface if phases have a structure
  doctor: IDoctorItem[] | null;
}
