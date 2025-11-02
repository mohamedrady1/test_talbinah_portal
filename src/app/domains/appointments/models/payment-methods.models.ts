// src/app/core/models/payment-methods.models.ts

import { IPaymentMethod } from "../dtos";


/**
 * Represents the state of the payment methods list within the application.
 */
export interface PaymentMethodsListState {
  methods: IPaymentMethod[]; // Array of payment method items
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean | null; // API status: true for success, false for error/no data
}

/**
 * Initial state for the payment methods list.
 */
export const initialPaymentMethodsListState: PaymentMethodsListState = {
  methods: [],
  isLoading: false,
  errorMessage: null,
  status: null,
};
