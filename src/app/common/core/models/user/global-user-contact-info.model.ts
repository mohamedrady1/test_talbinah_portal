import { ICountryDto } from "../../../../shared";

export interface IGlobalUserContactInfoModel {
  id: number;
  full_name: string;
  nick_name?: string | null;
  active: number;
  preferred_msg_channel?: string;
  created_at: string;

  // ✅ Keys found in response but not in the interface
  original_gender?: string | null;
  gid?: string | null;
  gender?: number;
  bio?: string | null;
  image?: string | null;
  is_support?: boolean | null;
  department?: any;
  birth_date?: string | null;
  national_id?: string | null;
  verify_national_id?: number;
  country?: ICountryDto | null | any;
  referral_code_points?: number;
  points_count?: number;

  // ✅ Optional fields not in the current response but may appear
  main_lang?: string;
  translate_id?: number | null;
  association_id?: number | null;
  fcm_token?: string | null;
  device_type?: string | null;
  device_name?: string | null;
  version_name?: string | null;
  version_code?: string | null;
  country_id?: number;
  phone_no?: string;
  phone_verified_at?: string | null;
  email?: string | null;
  reviews_count?: number;
  email_verified_at?: string | null;
  activation_date?: string | null;
  work_email?: string | null;
  work_email_verified_at?: string | null;
  remember_token?: string | null;
  owned_code?: string | null;
  referral_code?: string | null;
  role?: string | null;
  visible?: number;
  created_by?: string;
  last_seen?: string;
  coupon_notify?: number;
  updated_at?: string;
  original_active?: string;
  fcm_token_web?: string | null;
}
