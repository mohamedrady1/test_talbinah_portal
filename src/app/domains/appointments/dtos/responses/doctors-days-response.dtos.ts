export interface IDoctorDaysLookupsResponseDto {
  status: boolean;
  message: string | null;
  data: IDoctorDaysLookupData;
}

export interface IDoctorDaysLookupData {
  days: IDoctorDayItem[];
  vacations: any[]; // You can replace `any[]` with a real `IVacationItem[]` if available
}

export interface IDoctorDayItem {
  id: number;
  main_lang: string;           // e.g. 'ar'
  translate_id: number | null; // Nullable
  name: string;                // e.g. "السبت"
  day_id: number;              // 1 = Monday, 2 = Tuesday, etc.
  active: number;              // 1 = Active, 0 = Inactive
  original_active: string;     // e.g. "فعال"
  created_at: string;          // ISO Date string
}
