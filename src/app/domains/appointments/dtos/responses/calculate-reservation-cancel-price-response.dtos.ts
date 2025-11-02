export interface ICalcReservationCancelPriceResponseDto {
  status: boolean;
  message: string | null;
  data: ICalcReservationCancelPriceData | null;
}
export interface ICalcReservationCancelPriceData {
  original_price: number;
  returned_value: number;
  returned_precentage: number;
  deducted_value: number;
  message: string; // The translated message, e.g., "سيتم خصم مبلغ 1.5 ر.س"
}
