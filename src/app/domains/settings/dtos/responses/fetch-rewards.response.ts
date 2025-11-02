export interface IRewardsResponseDto {
  status: boolean;
  message: string | null;
  data: RewardItem[] | null;
}

export interface RewardItem {
  id: number;
  gift: RewardsCoupon | RewardsAppointment | null;
  service_name: string | null;
  name: string;
  points: number | null;
  point_before: number;
  point_original: number;
  point_after: number;
  type: string;
  original_type: string;
  expires_at: string | null;
  expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface RewardsCoupon {
  id: number;
  coupon: string | null;
  discount: number;
  discount_type: 'amount' | 'percentage';
  type: 'platform';
  doctor_id: number | null;
  duration_id: number | null;
  payment_id: number | null;
  user_limit_count: number;
  users_limit_count: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  visible_marketing: number;
  status: number;
  is_appear: number;
  created_at: string;
  updated_at: string;
  created_by_type: string | null;
  created_by_id: number | null;
  updated_by_type: string | null;
  updated_by_id: number | null;
  valid: boolean;
  user_usage_count: number;
  durations: unknown[]; // Can be replaced with proper type if known
}

export interface RewardsAppointment {
  id: number;
  main_lang: string;
  translate_id: number | null;
  doctor_id: number;
  appointment_id: number;
  duration_id: number;
  price: number;
  price_after: number;
  price_display: number | null;
  tax_amount: number;
  start_time: string;
  end_time: string;
  user_id: number;
  communication_id: number;
  payment_id: number;
  reason_rescheduling_id: number | null;
  full_name: string;
  gender: number;
  age: number;
  problem: string;
  date: string;
  notes: string | null;
  message: string | null;
  report: string | null;
  link: string | null;
  filename: string | null;
  is_start: number;
  is_end: number;
  status: number;
  type: string;
  active: number;
  locked: number;
  reference_payment_id: number | null;
  created_by: string;
  finance_attach: string | null;
  notified: number;
  website_notified: number;
  created_at: string;
  updated_at: string;
  package_id: number | null;
  programme_user_item_id: number | null;
  follow_doctor_id: number | null;
  transfer_doctor_id: number | null;
  is_refunded: number;
  refund_amount: number | null;
  refunded_at: string | null;
  refund_reason: string | null;
  original_active: string;
  original_status: string;
  original_gender: string;
  original_reservation_type: string;
  paid_price: number;
}
