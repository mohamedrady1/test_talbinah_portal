// --- Nested Interfaces ---

export interface IUserContactInfo {
  id: number;
  main_lang: string;
  translate_id: number | null;
  association_id: number | null;
  fcm_token: string | null;
  device_type: string;
  device_name: string | null;
  version_name: string | null;
  version_code: string | null;
  full_name: string;
  nick_name: string | null;
  country_id: number;
  phone_no: string;
  phone_verified_at: string | null;
  email: string;
  email_verified_at: string | null;
  activation_date: string | null;
  work_email: string | null;
  work_email_verified_at: string | null;
  remember_token: string | null;
  owned_code: string | null;
  referral_code: string | null;
  role: string;
  active: number; // Assuming 1 for active
  visible: number; // Assuming 1 for visible
  created_by: string;
  last_seen: string; // "YYYY-MM-DD HH:mm:ss"
  coupon_notify: number; // Assuming 0 for boolean-like
  preferred_msg_channel: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  original_active: string; // "فعال"
}

export interface IDayInfo {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string; // e.g., "السبت"
  day_id: number;
  active: number;
  original_active: string; // "فعال"
  created_at: string; // ISO 8601 date string
}

export interface IServiceInfo {
  id: number;
  title: string;
}

export interface ISpecialtyInfo {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  is_report: number; // Assuming 1 for boolean-like
  active: number; // Assuming 1 for active
  original_active: string; // "فعال"
}

export interface IBadgeInfo {
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
  is_active: number; // Assuming 1 for active
  created_at: string; // ISO 8601 date string
}

export interface IDoctorContactInfo {
  id: number;
  full_name: string;
  nick_name: string;
  phone_no: string;
  fcm_token: string;
  email: string | null;
  email_verified_at: string | null;
  bio: string;
  original_gender: string; // "ذكر"
  gender: number; // 0 or 1
  birth_date: string; // "YYYY-MM-DD"
  country: string | null;
  next_availability: string | null; // Can be null
  nextAvailability: string | null; // Can be null (camelCase vs snake_case)
  days: IDayInfo[];
  image: string | null;
  reviews_avg: number;
  price_half_hour: number;
  last_services: IServiceInfo[];
  specialties: ISpecialtyInfo[];
  years_experience: number;
  license_number: string;
  reservations_count: number;
  is_fav: boolean;
  created_by: string | null;
  active: number; // Assuming 1 for active
  created_at: string; // ISO 8601 date string
  services: IServiceInfo[];
  copouns: any[]; // Empty array in mock, consider more specific if actual data varies
  packages: any[]; // Empty array in mock, consider more specific if actual data varies
  programme: any[]; // Empty array in mock, consider more specific if actual data varies
  badges: IBadgeInfo[];
  is_recommended: boolean;
  is_classified: boolean;
}

export interface IDurationDetail {
  id: number;
  main_lang: string;
  translate_id: number | null;
  duration: number; // in minutes
  active: number; // Assuming 1 for active
  original_active: string; // "فعال"
  created_at: string; // ISO 8601 date string
}

export interface ICommunicationDetail {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string; // e.g., "مكالمة اتصال"
  description: string;
  image: string;
  price: number;
  color: string;
  hard_color: string;
  active: number; // Assuming 1 for active
  original_active: string; // "فعال"
  created_at: string; // ISO 8601 date string
}

export interface IPaymentDetail {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string; // e.g., "دفع من خلال المحفظة"
  image: string;
  active: number; // Assuming 1 for active
  original_active: string; // "فعال"
  created_at: string; // ISO 8601 date string
  package: any | null; // Can be null
  payment_id: number;
  balance: number;
}


// --- Main Reservation Interfaces ---

export interface IReservationInnerDto {
  id: number;
  url: string | null;
  price: number;
  user: IUserContactInfo;
  doctor: IDoctorContactInfo;
  is_start: number; // 1 for started
  is_end: number; // 0 for not ended
  original_is_start: string; // "attributes.Started"
  original_is_end: string; // "لم تنتهي"
  visit_chat_time_user: string | null; // Can be null
  visit_chat_time_doctor: string | null; // Can be null or "YYYY-MM-DD HH:mm:ss"
  visit_call_time_user: string | null;
  visit_call_time_doctor: string | null;
  day: string; // e.g., "الأربعاء"
  start_time: string; // "HH:mm:ss"
  end_time: string; // "HH:mm:ss"
  date: string; // "YYYY-MM-DD"
  duration: IDurationDetail;
  review: any | null; // Can be null, define a specific interface if it becomes complex
  communication: ICommunicationDetail;
  payment: IPaymentDetail;
  problem: string;
  message: string | null;
  description: string | null;
  notes: string | null;
  report: any | null; // Can be null, define a specific interface if it becomes complex
  filename: string | null;
  link: string | null;
  report_file: string;
  full_name: string;
  gender: number; // 0 or 1
  age: number;
  reason: string | null;
  active: number; // Assuming 1 for active
  status: number; // Assuming 1 for current status
  is_blocked: boolean;
  original_active: string; // "فعال"
  original_status: string; // "قادم"
  reservation_type: string; // "emergency"
  original_type: string; // "عاجله"
  created_at: string; // ISO 8601 date string
}

export interface IReservationDetailsDto {
  id: number;
  url: string | null;
  remaining_time: number;
  full_name: string;
  specialist_id: number;
  reservation: IReservationInnerDto | null; // Now correctly typed
  payment_id: number;
  problem: string;
  duration: number;
  price: number;
  payment_status: number;
  original_payment_status: string;
  status: string | null; // Based on mock, can be "1" (string) or null
  original_status: string | null; // Based on mock, can be null
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

// The main response DTO for the API call
export interface ICheckEmergencyAppointmentReservationResponseDto {
  status: boolean;
  message: string | null;
  data: IReservationDetailsDto | null;
}
