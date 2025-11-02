// src/app/core/facades/payment-methods.facade.ts

import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';


import { Logger, ApiError, handleApiErrors } from '../../../common'; // Adjust path as necessary
import { IPaymentMethodsListingResponseDto } from '../dtos';
import { PaymentMethodsListState, initialPaymentMethodsListState } from '../models';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';

const PAYMENT_METHODS_STATE_KEY = makeStateKey<PaymentMethodsListState>('paymentMethodsState');

@Injectable({ providedIn: 'root' })
export class PaymentMethodsFacade {
  // private readonly _apiClient: IPaymentMethodsApiClient = inject(PaymentMethodsApiClientProvider);
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // Internal state managed by a signal
  private readonly _state = signal<PaymentMethodsListState>(initialPaymentMethodsListState);

  // Public selectors (computed signals) to expose the state
  readonly paymentMethods = computed(() => this._state().methods);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly status = computed(() => this._state().status);

  constructor() {
    // Hydrate state from TransferState on the browser after SSR
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<PaymentMethodsListState>(
      //   PAYMENT_METHODS_STATE_KEY,
      //   initialPaymentMethodsListState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating payment methods from TransferState', cachedState);
      //   this._updateState(cachedState);
      //   this._transferState.remove(PAYMENT_METHODS_STATE_KEY); // Remove once hydrated
      // }
    }
  }

  /**
   * Fetches the list of payment methods from the API.
   * Handles loading states, errors, and TransferState caching for SSR.
   */
  fetchPaymentMethods(): void {
    Logger.debug('Fetching payment methods...');

    // Optimistically set loading state and clear previous errors
    this._updateState({ isLoading: true, errorMessage: null, status: null });

    // Try to retrieve from TransferState cache first (only on browser and if data exists)
    // const cached = this._transferState.get<PaymentMethodsListState>(
    //   PAYMENT_METHODS_STATE_KEY,
    //   null as any
    // );

    // if (isPlatformBrowser(this._platformId) && cached?.methods?.length > 0) {
    //   Logger.debug('Using cached payment methods from TransferState');
    //   this._updateState({
    //     methods: cached.methods,
    //     status: cached.status,
    //     isLoading: false,
    //     errorMessage: null,
    //   });
    //   this._transferState.remove(PAYMENT_METHODS_STATE_KEY);
    //   return;
    // }

    // If no cached data or not on browser, make API call
    this._apiClient.getPaymentMethods()
      .pipe(
        tap((response: IPaymentMethodsListingResponseDto) => {
          if (response?.status && response.data?.length > 0) {
            // Update state with successful data
            this._updateState({
              methods: response.data,
              status: response.status,
              errorMessage: null,
            });
            Logger.debug('Payment methods fetched successfully:', response);
          } else {
            // Handle cases where API call is successful but no data or status is false
            this._updateState({
              methods: [],
              status: response.status,
              errorMessage: response.message || '📭 No payment methods found.',
            });
            Logger.debug('No payment methods found or API status is false.');
          }

          // Store the current state in TransferState during SSR (on server-side rendering)
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(PAYMENT_METHODS_STATE_KEY, this._state());
            Logger.debug('Stored payment methods state in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          // Handle API errors
          this._updateState({
            methods: [],
            status: false, // Indicate an error status
            errorMessage: '🚨 Error loading payment methods. Please try again later.',
          });
          Logger.error('Error fetching payment methods:', error);
          handleApiErrors(error); // Trigger a global error handler (e.g., show a toast)
          return EMPTY; // Prevent the observable from completing with an error
        }),
        finalize(() => {
          // Always reset loading state when the observable completes or errors
          this._updateState({ isLoading: false });
        })
      )
      .subscribe();
  }

  /**
   * Resets the facade's state to its initial values.
   */
  resetState(): void {
    this._state.set(initialPaymentMethodsListState);
    Logger.debug('Payment methods facade state has been reset.');
  }

  /**
   * Internal helper to immutably update the facade's state signal.
   * @param updates Partial state object to merge into the current state.
   */
  private _updateState(updates: Partial<PaymentMethodsListState>): void {
    this._state.update(state => ({ ...state, ...updates }));
  }
}
