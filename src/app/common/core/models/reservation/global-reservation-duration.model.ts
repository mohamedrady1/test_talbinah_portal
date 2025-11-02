export interface IGlobalReservationDurationModel {
  id: number;
  main_lang: string;
  translate_id: number | null;
  duration: number;
  active: number;
  original_active: string;
  created_at: string;
}
