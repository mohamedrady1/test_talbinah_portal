import { IGlobalUserContactInfoModel } from "../../../../common";

export interface IUserData {
  token: string;
  user: IGlobalUserContactInfoModel | null;
}

export interface IUser {
  id: number;
  main_lang: string;
  translate_id: number | null;
  full_name: string;
  nick_name: string | null;
  phone_no: string;
  bio: string | null;
  original_gender: string | null;
  gender: number;
  birth_date: string;
  national_id: string | number | null;
  verify_national_id: number;
  country: ICountry;
  fcm_token: string | null;
  email: string | null;
  email_verified_at: string | null;
  work_email: string | null;
  work_email_verified_at: string | null;
  original_active: string;
  active: number;
  referral_code: string | null;
  referral_code_points: number;
  device_type: string;
  device_name: string | null;
  version_name: string | null;
  version_code: string | null;
  preferred_msg_channel: string;
  created_at: string;
  image: string | null;
  points_count?: number;
  user_score?: number;
}

export interface ICountry {
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
  user_score?: number;
}
