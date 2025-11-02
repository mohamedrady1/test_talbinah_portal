// src/app/core/dtos/payment-methods.dtos.ts

/**
 * Represents a single payment method returned by the API.
 */
export interface IPaymentMethod {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  image: string;
  active: number; // Consider converting to boolean if 0/1 is used as boolean
  original_active: string;
  created_at: string; // ISO 8601 string
  package: any | null; // Define a more specific type if 'package' has a structure
  payment_id: number;
  balance: number | null;
}

/**
 * Represents the full API response structure for listing payment methods.
 */
export interface IPaymentMethodsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPaymentMethod[];
}
