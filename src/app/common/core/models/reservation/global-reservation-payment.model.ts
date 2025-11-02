export interface IGlobalReservationPaymentModel {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  image: string;
  active: number;
  original_active: string;
  created_at: string;
  package: any | null;
  payment_id: number;
  balance: number;
}
