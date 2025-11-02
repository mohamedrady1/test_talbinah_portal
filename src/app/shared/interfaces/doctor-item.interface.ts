import { ITherapeuticProgram } from "../../domains";


// Interface for Country
export interface ICountryDto {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  flag: string;
  code: string;
  code2: string;
  numcode: string;
  phone_code: string;
  active: 0 | 1;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  original_active: string;
}

export interface IDoctorItem {
  id: number;
  full_name: string;
  specialist: string[];
  specialist_id: number[];
  bio: string;
  gender: number;
  reservation_count: number | null;
  avg_rate: number;
  count_rate: number;
  image: string | null;
  price_half_hour: number;
  years_experience: number;
  copouns: any[];
  nextAvailability: IAvailabilityDoctorItem | null;
  nick_name?: string;
  phone_no?: string;
  fcm_token?: string | null;
  email?: string | null;
  email_verified_at?: string | null;
  original_gender?: string;
  birth_date?: string;
  country?: string | null | ICountryDto;
  license_image?: string | null;
  license_expiry_date?: Date | string | null;
  iban?: number | string | null;
  next_availability?: any | null;
  reviews_avg?: number;
  specialties?: ISpecialtyDoctorItem[];
  reviews_count?: number;
  license_number?: string;
  coupons?: any | null;
  association?: any | null;
  preferred_msg_channel?: any | null;

  // Additional properties directly from your mock that were missing or had differing types
  device_type?: string | null;
  device_name?: string | null;
  version_name?: string | null;
  version_code?: string | null;
  national_id?: string | null;
  bank_name?: string | null;

  reservations_count?: number;
  is_fav?: boolean;
  created_by?: string;
  active?: number; // Added this property to match the mock data
  created_at?: string;
  invited?: any | null;
  badges?: IBadgeDoctorItem[];
  is_recommended?: boolean;
  is_classified?: boolean;
  days?: IDay[];
  packages?: any | null;
  programme?: ITherapeuticProgram | null;
  services?: IService[] | null;
}

/**
 * Interface for a single day entry in a doctor's schedule.
 */
export interface IDay {
  id: number;
  main_lang: string;
  translate_id: null;
  name: string; // e.g., "السبت", "الأحد"
  day_id: number; // Numeric ID for the day (e.g., 6 for Saturday, 7 for Sunday, 1 for Monday)
  active: number; // 1 for active, 0 for inactive
  original_active: string; // e.g., "فعال"
  created_at: string;
}

export interface IAvailabilityDoctorItem {
  id: number;
  doctor_id: number;
  day_id: number;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface ISpecialtyDoctorItem {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  is_report: number;
  active: number;
  original_active: string;
}

export interface IBadgeDoctorItem {
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

export interface IService {
  id: number;
  title: string;
}
