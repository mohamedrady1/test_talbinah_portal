export interface INextAvailabilityModel {
  id: number;
  doctor_id: number;
  day_id: number;
  date: string; // Format: "YYYY-MM-DD"
  start_time: string; // Format: "HH:MM:SS"
  end_time: string; // Format: "HH:MM:SS"
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
}
