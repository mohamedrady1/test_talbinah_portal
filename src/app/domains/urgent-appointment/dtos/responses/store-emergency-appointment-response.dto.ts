export interface IEmergencyAppointmentItemDto {
  id: number;
  url: string | null;
  remaining_time: number;
  full_name: string;
  specialist_id: number | string; // Assuming this should be a number ID
  reservation: any | null; // Based on mock, can be null, adjust type if specific object structure is known
  payment_id: number | string; // Assuming this should be a number ID
  problem: string;
  duration: number; // Represents the duration in minutes
  price: number;
  payment_status: number;
  original_payment_status: string;
  status: any | null; // Based on mock, can be null, adjust type if specific object structure is known
  original_status: any | null; // Based on mock, can be null, adjust type if specific object structure is known
  created_at: string; // ISO 8601 string, e.g., "2025-06-23T08:01:49.000000Z"
  updated_at: string; // ISO 8601 string, e.g., "2025-06-23T08:01:49.000000Z"
}

// Response DTO for the /Seminars/store API (or similar store API)
export interface IStoreEmergencyAppointmentResponseDto {
  status: boolean;
  message: string | null;
  data: IEmergencyAppointmentItemDto | null; // The detailed appointment data on success
}
