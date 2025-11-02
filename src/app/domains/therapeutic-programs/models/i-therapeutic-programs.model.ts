import { IDoctorItem } from "../../../shared";

export interface ITherapeuticProgram {
  id: number; // Changed to number based on data
  programme_id?: number;
  price: number; // Renamed from cost, added based on data
  discount: number; // Added based on data
  original_price: number; // Added based on data
  title: string;
  description: string; // Renamed from details
  programme_period: number; // Added based on data
  active: number; // Added based on data
  image: string | null; // Added based on data, can be null
  url: string | null; // Added based on data, can be null
  usage_number: number; // Added based on data
  reminder_seats: number; // Added based on data
  phases_count: number; // Added based on data
  sessions_count: number; // Added based on data
  is_purchased: boolean; // Added based on data
  link?: string;
  seats_label?: string | null;

  // Note: 'phases' is a simplified type here, it will be extended in ITherapeuticProgramDetails
  phases: any[] | null; // Can be more specific if structure is consistent
  doctor: any[] | null; // Can be more specific if structure is consistent, extended in ITherapeuticProgramDetails
}

export interface ITherapeuticProgramDetails extends ITherapeuticProgram {
  // Updated 'phases' to be an array of IPhase
  phases: IPhase[] | null;
  // Updated 'doctor' to be an array of IDoctorItem (or a single IDoctorItem if it's always one)
  doctor: IDoctorItem[] | null;
}
export interface IPhase {
  id: number;
  title: string;
  type: string;
  original_type: string;
  description: string | null;
  pdf: string | null;
  link: string | null;
  video: string | null;
  duration: number;
  duration_id: number;
  doctor_id: number | null;
  article: string | null;
  doctor: IDoctorItem[]; // Array of doctors within the phase
}
