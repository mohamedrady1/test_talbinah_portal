// src/app/common/models/global-doctor-contact-info.model.ts

import { IGlobalDoctorSpecialtyModel } from './global-doctor-specialty.model';
import { IGlobalDoctorProgrammeModel } from './global-doctor-programme.model';
import { IGlobalDoctorServiceModel } from './global-doctor-service.model';
import { IGlobalDoctorPackageModel } from './global-doctor-package.model';
import { IGlobalDoctorCountryModel } from './global-doctor-country.model';
import { INextAvailabilityModel } from './global-next-availability.model';
import { IGlobalDoctorCopounModel } from './global-doctor-copoun.model';
import { IGlobalDoctorBadgeModel } from './global-doctor-badge.model';
import { IGlobalDoctorDayModel } from './global-doctor-day.model';
import { IGlobalDoctorReviewModel } from './global-doctor-review.model';

export interface IGlobalDoctorContactInfoModel {
  id: number;
  full_name: string;
  nick_name: string;
  phone_no: string;
  email: string | null;
  original_gender: string;
  gender: number;
  birth_date: string;
  bio: string;
  image: string | null;
  license_number: string;
  price_half_hour: number;
  specialties?: IGlobalDoctorSpecialtyModel[];
  services?: IGlobalDoctorServiceModel[];
  badges?: IGlobalDoctorBadgeModel[];
  reviews_avg: number;
  is_fav: boolean;
  years_experience: number;
  is_blocked?: boolean;
  active: number;
  created_at: string;

  // ✅ Updated next_availability to the new interface
  next_availability?: INextAvailabilityModel | null;
  // nextAvailability?: INextAvailabilityModel | null; // Keep if both camelCase and snake_case are used in different responses

  // ✅ Optional because they may be missing
  fcm_token?: string;
  reviews_count?: number;
  is_support?: boolean | null;
  department?: any;
  reservations_count?: number;
  email_verified_at?: string | null;
  days?: IGlobalDoctorDayModel[] | null;
  last_services?: IGlobalDoctorServiceModel[] | null;
  created_by?: string | null;
  copouns?: IGlobalDoctorCopounModel[] | null
  packages?: IGlobalDoctorPackageModel[] | null;
  programme?: IGlobalDoctorProgrammeModel[] | null;
  coupons?: IGlobalDoctorCopounModel[] | null;
  reviews?: IGlobalDoctorReviewModel[] | null;
  patients_count?: number | null;
  iban?: string | null;
  license_image?: string | null;
  license_expiry_date?: string | null;
  national_id?: string | null;
  bank_name?: string | null;
  preferred_msg_channel?: string;
  device_type?: string | null;
  device_name?: string | null;
  version_name?: string | null;
  version_code?: string | null;
  association?: any | null; // Consider creating a specific interface for association if its structure is known
  country?: IGlobalDoctorCountryModel | null;

  // ✅ These were missing from some responses
  is_recommended?: boolean;
  is_classified?: boolean;
}
