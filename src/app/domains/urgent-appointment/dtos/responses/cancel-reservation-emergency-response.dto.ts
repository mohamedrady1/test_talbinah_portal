// First, define the interface for the 'data' object within the response
export interface ICancelEmergencyAppointmentDataDto {
  id: number;
  user_id: number;
  doctor_id: number | null; // Can be null as per the mock data
  specialist_id: number;
  payment_id: number;
  reservation_id: number | null; // Can be null
  duration: number; // Assuming minutes
  problem: string;
  full_name: string;
  age: number;
  gender: string; // "0" or "1" (assuming string for consistency with mock)
  price: number;
  tax_amount: number;
  payment_status: number; // "1" for paid
  status: string; // "0" for cancelled
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  original_status: string; // "ملغي"
  original_payment_status: string; // "مدفوع"
}

// Then, define the interface for the entire response structure
export interface ICancelEmergencyAppointmentResponseDto {
  status: boolean;
  message: string | null; // Can be null
  data: ICancelEmergencyAppointmentDataDto;
}
