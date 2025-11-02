import {
  IGlobalDoctorContactInfoModel,
  IGlobalDoctorCopounModel,
  IGlobalReservationCommunicationModel,
  IGlobalReservationDurationModel,
  IGlobalReservationPaymentModel,
  IGlobalUserContactInfoModel
} from '../../../common';
import { ICalculationPayments, ICancelationReasonItem } from '../dtos';

export interface IGlobalReservationModel {
  id: number;
  itemId?: number;
  price: number;
  doctor?: IGlobalDoctorContactInfoModel;
  user?: IGlobalUserContactInfoModel;
  payments?: ICalculationPayments;
  is_start: number;
  is_end: number;
  original_is_start: string;
  original_is_end: string;
  start_time: string;
  end_time: string;
  date: string;
  age: number;
  gender: number;
  problem: string | null;
  reason?: ICancelationReasonItem | null;
  duration?: IGlobalReservationDurationModel;
  communication?: IGlobalReservationCommunicationModel;
  payment?: IGlobalReservationPaymentModel | null;
  reservation_type: string;
  original_type: string;
  active: number;
  original_active: string;
  status: number;
  original_status: string;
  is_blocked: boolean;
  created_at: string;

  // ✅ Optional: found in response
  price_after?: number;
  price_display?: number;
  assignment_count?: number;
  assignment_reviewed_count?: number;
  coupon?: IGlobalDoctorCopounModel | null;
  tax_amount?: number | string | null;
  admin_locked?: boolean;
  doctor_locked?: boolean;
  updated_at?: string;
  iban?: string | null;
  national_id?: string | null;
  bank_name?: string | null;
  remaining_time?: number | null;
  current_time?: string | null
  follow_doctor?: any;
  transfer_doctor?: any;
  suggest_doctor?: any;
  tickets?: any | null;
  time_line?: IReservationTimeline[] | null;
  assignments?: any | null;
  prescriptions?: any | null;
  // ✅ Optional: exists in model but not in this response
  url?: string | null;
  visit_chat_time_user?: string | null;
  visit_chat_time_doctor?: string | null;
  visit_call_time_user?: string | null;
  visit_call_time_doctor?: string | null;
  day?: string;
  review?: any | null;
  message?: string | null;
  description?: string | null;
  notes?: string | null;
  report?: any | null;
  filename?: string | null;
  file_size?: number | null;
  file_date?: number | null;
  link?: string | null;
  report_file?: string | null;
  full_name?: string;
}

export interface IReservationTimeline {
  id: number;
  reservation_id: number;
  description: string;
  label: string;
  status: string;
  doctor: any;
  created_at: string;
}
