
export interface IScheduleReservationRequestDto {
  doctor_id: number;
  day_id: number;
  start_time: string;     // Format: "HH:mm"
  end_time: string;       // Format: "HH:mm"
  date: string;           // Format: "YYYY-MM-DD"
  time_id: number;
  duration_id: number;
  reason: string;
  reason_id: number;
}
