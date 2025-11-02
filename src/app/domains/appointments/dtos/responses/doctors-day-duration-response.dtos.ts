export interface IDoctorSlotsTimesResponseDto {
  status: boolean;
  message: string | null;
  data: IDoctorDurationItem[];
}

export interface IDoctorDurationItem {
  id: number;
  main_lang: string;
  translate_id: number | null;
  doctor_id: number;
  day_id: number; // e.g., 2 for Tuesday
  start_time: string; // "HH:mm:ss"
  end_time: string;   // "HH:mm:ss"
  free: number;       // 0 or 1
  active: number;     // 0 or 1
  deleted_at: string | null; // Nullable timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  times: IDoctorDurationTimeSlot[];
  original_active: string; // "فعال"
}

export interface IDoctorDurationTimeSlot {
  start_time: string; // "HH:mm"
  end_time: string;   // "HH:mm"
}
