import { IDoctorItem, ISpecialtyDoctorItem } from "../../../../shared";
import { IMentalHealthReportItemDto } from "./mental-health-scales-listing-response.dto";

// Example placeholder interfaces (adjust based on your actual data models)
export interface IMentalResult {
  id: number;
  mental_category_id: number;
  start_percentage: number;
  end_percentage: number;
  result_note: string;
  title: string;
  sub_title: string;
  created_at: string;
  updated_at: string;
  pivot?: { // This pivot structure indicates a many-to-many relationship
    user_id: number;
    mental_result_id: number;
    result: number; // Score or grade
    created_at: string;
  };
}

export interface ICreateMentalHealthScaleResponseDto {
  status: boolean;
  message: string;
  data: IMentalHealthReportItemDto;
}

// src/app/features/mental-health-scales/dtos/suggested-doctor.interface.ts
// (Or wherever you prefer to define interfaces related to doctors)

// Reusing existing common interfaces if they are defined elsewhere
// If not, define them here or in a shared 'domains' or 'shared/dtos' folder.

export interface ISuggestedDoctorAvailability {
  id: number;
  doctor_id: number;
  day_id: number;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface ISuggestedDoctorDay {
  id: number;
  main_lang: string;
  translate_id: null;
  name: string; // e.g., "السبت"
  day_id: number; // Numeric ID for the day (e.g., 6 for Saturday)
  active: number; // 1 for active, 0 for inactive
  original_active: string; // e.g., "فعال"
  created_at: string;
}

export interface ISuggestedDoctorSpecialty {
  id: number;
  name: string; // e.g., "أخصائي إجتماعي"
  description: string;
  image: string;
  color: string;
  is_report: number;
  active: number;
  original_active: string;
  created_at: string;
}

export interface ISuggestedDoctorService {
  id: number;
  title: string; // e.g., "اضطرابات الأكل"
}

export interface ISuggestedDoctorBadge {
  id: number;
  name: string;
  description: string | null;
  type: string;
  display_type: string;
  condition_type: string;
  display_condition_type: string;
  condition_value: number;
  doctor_percentage: number | null;
  color: string;
  icon: string;
  is_active: number;
  created_at: string;
}

export interface ISuggestedDoctor {
  id: number;
  full_name: string;
  nick_name: string | null;
  phone_no: string;
  fcm_token: null;
  email: null;
  email_verified_at: null;
  bio: string;
  original_gender: string; // "ذكر"
  gender: number; // 0 for male, 1 for female
  birth_date: string; // "1970-12-04"
  country: null; // Can be string if country data is populated
  nextAvailability: ISuggestedDoctorAvailability | null;
  days: ISuggestedDoctorDay[];
  image: string;
  reviews_avg: number;
  price_half_hour: number;
  specialties: ISuggestedDoctorSpecialty[];
  years_experience: number;
  license_number: string;
  reservations_count: number;
  is_fav: boolean;
  copouns: any[]; // Define a specific interface if coupons have structure
  packages: null; // Define a specific interface if packages have structure
  programme: null; // Define a specific interface if programme has structure
  services: ISuggestedDoctorService[];
  created_by: string;
  active: number; // 1 for active
  created_at: string;
  badges: ISuggestedDoctorBadge[];
}
