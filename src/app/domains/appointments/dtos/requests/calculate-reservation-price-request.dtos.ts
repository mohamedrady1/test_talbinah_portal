// Defines the request payload for calculating the reservation price
export interface ICalculateReservationPriceRequestDto {
  payment_id: string | number | null | undefined;
  programme_id?: string | number | null | undefined;
  seminar_id?: string | number | null | undefined;
  is_emergency?: number | null | undefined;
  specialist_id?: number | null | undefined;
  duration_id?: number | null | undefined;
  doctor_id?: number | null | undefined;
  package_id?: number | null | undefined;
  coupon?: string | number | null | undefined;
}
