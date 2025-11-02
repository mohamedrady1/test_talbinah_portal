// Define a single payment detail item, like "total" or an item in "payments" array
export interface ICalculationPaymentDetail {
  currency: string | null; // e.g., "ر.س"
  value: number | string;    // e.g., 379.5
  label: string;    // e.g., "الاجمالى", "سعر الجلسات"
}

// Defines the structure of the 'payments' object within the response data
export interface ICalculationPayments {
  total: ICalculationPaymentDetail;
  payments: ICalculationPaymentDetail[]; // Array of detailed payment breakdowns
}

// Defines the main 'data' object within the API response
export interface ICalculateReservationPriceResponseData {
  payments: ICalculationPayments;
  coupon_id: string | null;
  couponErrorMessage: string | null;
}

// Defines the overall response structure from the API
export interface ICalculateReservationPriceResponseDto {
  status: boolean;
  message: string | null;
  data: ICalculateReservationPriceResponseData | null; // Can be null on error
}
