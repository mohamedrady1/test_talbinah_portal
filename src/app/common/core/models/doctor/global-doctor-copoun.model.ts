import { IDoctorAvailability } from "../../../../domains/talbinah-bot/models";

export interface ICouponDuration {
  id: number;
  main_lang: string;
  translate_id: null; // Based on the mock, it's always null. If it can be a number, change to `null | number`.
  duration: number; // Duration in minutes
  active: number; // Assuming 1 for active, 0 for inactive
  original_active: string; // e.g., "فعال"
  created_at: string; // ISO 8601 date string
}
export interface IGlobalDoctorCopounModel {
  id: number;
  coupon: string; // The coupon code
  discount: number; // The discount value
  discount_type: 'percentage' | 'fixed' | string; // Type of discount
  type: 'doctor' | string; // Type of coupon, e.g., 'doctor'
  doctor_id: number; // ID of the doctor this coupon applies to
  durations: ICouponDuration[]; // Array of applicable session durations
  user_limit_count: number; // Limit of uses per single user
  users_limit_count: number; // Total limit of uses across all users
  usage_count: number; // How many times the coupon has been used
  start_date: string; // Start date of the coupon validity (YYYY-MM-DD)
  end_date: string; // End date of the coupon validity (YYYY-MM-DD)
  status: number; // Coupon status (e.g., 1 for active)
  is_appear: number; // Whether the coupon should appear (e.g., 1 for true)
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
  duration_id?: any;
  payment_id?: any;
}
