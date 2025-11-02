export interface IGlobalReservationCommunicationModel {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  description: string;
  selected?: boolean | any | null;
  un_selected?: boolean | any | null;
  image: string;
  price: number;
  color: string;
  hard_color: string;
  active: number;
  original_active: string;
  created_at: string;
}
