// --- API Raw DTOs (exactly as received) ---
export interface ITechnicalSupportChatResponseDto {
  status: boolean;
  message: string | null;
  data: ITechnicalSupportChatDto[];
}

export interface ITechnicalSupportChatDto {
  id: number;
  department_id: {
    id: number;
    title: string;
  } | null;
  user_id: ITechnicalSupportUserDto;
  customer_support_user_id: ITechnicalSupportUserDto | null;
  is_started: boolean;
  is_closed: boolean;
  queue: number;
}

export interface ITechnicalSupportUserDto {
  id: number;
  main_lang: string;
  translate_id: number | null;
  full_name: string;
  nick_name: string;
  phone_no: string;
  bio: string | null;
  original_gender: string;
  gender: number;
  birth_date: string | null;
  national_id: string | null;
  verify_national_id: number;
  country: ITechnicalSupportCountryDto | null;
  fcm_token: string | null;
  fcm_token_web: string | null;
  email: string | null;
  email_verified_at: string | null;
  work_email: string | null;
  work_email_verified_at: string | null;
  original_active: string;
  active: number;
  referral_code: string | null;
  referral_code_points: number;
  device_type: string | null;
  device_name: string | null;
  version_name: string | null;
  version_code: string | null;
  preferred_msg_channel: string | null;
  created_at: string;
  image: string | null;
  is_support: boolean;
  department: any | null;
  points_count?: any | null;
}

export interface ITechnicalSupportCountryDto {
  id: number;
  main_lang: string;
  translate_id: number | null;
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
