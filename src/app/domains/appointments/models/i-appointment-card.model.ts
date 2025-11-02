// src/app/features/book-appointment/i-next-availability.interface.ts
// (Assuming this path as per your original import, adjust if needed)
export interface INextAvailability {
  // Define properties of next availability if known, otherwise it can be an empty object or any if its structure is not fixed
  // Example properties if it's an object:
  date: string;
  time: string;
  // ... other properties
}

// --- ICountry ---
// src/app/shared/interfaces/i-country.interface.ts (Recommended path)
export interface ICountry {
  id: number;
  main_lang: string;
  translate_id: null;
  name: string;
  flag: string;
  code: string;
  code2: string;
  numcode: string;
  phone_code: string;
  active: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  original_active: string;
}

// --- ISpecialty ---
// src/app/shared/interfaces/i-specialty.interface.ts (Recommended path)
export interface ISpecialty {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  is_report: number;
  active: number;
  original_active: string;
}

// --- IService ---
// src/app/shared/interfaces/i-service.interface.ts (Recommended path)
export interface IService {
  id: number;
  title: string;
}

// --- IBadge ---
// src/app/shared/interfaces/i-badge.interface.ts (Recommended path)
export interface IBadge {
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

export interface ISpecialist { // Renamed from IDoctor to ISpecialist as per your import
  id: number;
  full_name: string;
  phone_no: string;
  country: ICountry;
  nick_name: string;
  email: string | null;
  original_gender: string;
  gender: number; // 0 for male, 1 for female
  birth_date: string;
  bio: string;
  license_number: string;
  license_image: string | null;
  license_expiry_date: string | null;
  image: string;
  specialties: ISpecialty[];
  price_half_hour: number;
  iban: string | null;
  next_availability: INextAvailability | null; // Can be null as per JSON
  years_experience: number;
  coupons: any[]; // Define a proper ICoupon interface if structure is known
  services: IService[];
  association: string | null;
  reviews_avg: number;
  is_fav: boolean;
  active: number;
  preferred_msg_channel: string;
  device_type: string;
  device_name: string;
  version_name: string;
  version_code: string;
  created_at: string;
  national_id: string | null;
  bank_name: string | null;
  badges: IBadge[];
}

// --- IUser ---
// src/app/features/appointments/models/i-user.interface.ts (Recommended path)
export interface IUser {
  id: number;
  full_name: string;
  nick_name: string;
  original_gender: string;
  gender: number; // 0 for male, 1 for female
  image: string | null;
  active: number;
  preferred_msg_channel: string;
  created_at: string;
}

// --- IDuration ---
// src/app/shared/interfaces/i-duration.interface.ts (Recommended path)
export interface IDuration {
  id: number;
  main_lang: string;
  translate_id: null;
  duration: number; // e.g., 15 (minutes)
  active: number;
  original_active: string;
  created_at: string;
}

// --- ICommunication ---
// src/app/shared/interfaces/i-communication.interface.ts (Recommended path)
export interface ICommunication {
  id: number;
  main_lang: string;
  translate_id: null;
  name: string;
  description: string;
  image: string;
  price: number;
  color: string;
  hard_color: string;
  active: number;
  original_active: string;
  created_at: string;
}
export interface IAppointment {
  id: number;
  price: number;
  price_after: number;
  price_display: number;
  doctor: ISpecialist; // Now uses the ISpecialist interface
  user: IUser;
  is_start: number; // 0 or 1
  is_end: number;   // 0 or 1
  original_is_start: string;
  original_is_end: string;
  start_time: string;
  assignment_count: number;
  assignment_reviewed_count: number;
  end_time: string;
  date: string; // e.g., "2025-05-20"
  age: number;
  problem: string;
  duration: IDuration;
  communication: ICommunication;
  gender: number; // This 'gender' is for the patient of the reservation
  link: string | null;
  report_file: string | null;
  is_blocked: boolean;
  reservation_type: string;
  original_type: string;
  active: number; // 0 or 1
  admin_locked: boolean;
  doctor_locked: boolean;
  original_active: string;
  status: number; // 0 or 1 (e.g., 1 for "قادم")
  original_status: string;
  created_at: string;
  updated_at: string;
}
