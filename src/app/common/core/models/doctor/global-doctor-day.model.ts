export interface IGlobalDoctorDayModel {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  day_id: number;
  active: number;
  original_active: string;
  created_at: string;
}
