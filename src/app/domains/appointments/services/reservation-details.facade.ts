import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';

// Common/Shared modules and services
import { Logger, ApiError, handleApiErrors, IApiResponse } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';

// API Clients
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';

// State models for this facade
import { IGlobalReservationModel, initialReservationDetailsState, IReservationDetailsState } from '../models';


// TransferState Key for SSR hydration
const RESERVATION_DETAILS_STATE_KEY = makeStateKey<IReservationDetailsState>('reservationDetails');

@Injectable({
  providedIn: 'root'
})
export class ReservationDetailsFacade { // Renamed from SessionWithDoctorFacade for clarity
  // --- Dependencies ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature States (Signals) ---
  private readonly _reservationDetailsState = signal<IReservationDetailsState>(initialReservationDetailsState);

  // --- Selectors (Computed Signals) ---
  readonly currentReservation = computed(() => this._reservationDetailsState().reservation); // The actual IReservation object
  readonly isLoadingReservation = computed(() => this._reservationDetailsState().isLoading);
  readonly reservationFetchStatus = computed(() => this._reservationDetailsState().status); // Status of the fetch operation
  readonly reservationFetchErrorMessage = computed(() => this._reservationDetailsState().errorMessage);

  openReservationDetails = new BehaviorSubject<{ id: number } | null>(null);
  constructor() {
    this._initFromTransferState();
  }

  private _initFromTransferState(): void {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<IReservationDetailsState>(RESERVATION_DETAILS_STATE_KEY, initialReservationDetailsState);
      // if (cachedState && cachedState.reservation) {
      //   Logger.debug('[ReservationDetailsFacade] Hydrating reservation details from TransferState', cachedState.reservation);
      //   this._updateReservationDetailsState(cachedState);
      //   // Remove from TransferState after hydration to prevent re-hydration issues on subsequent navigations
      //   this._transferState.remove(RESERVATION_DETAILS_STATE_KEY);
      // }
    }
  }

  fetchReservationDetails(reservationId: number): void {
    Logger.debug(`[ReservationDetailsFacade] Attempting to fetch reservation details for ID: ${reservationId}`);
    this._updateReservationDetailsState({ isLoading: true, errorMessage: null }); // Set loading state and clear previous errors

    this._apiClient.getReservationById(reservationId).pipe(
      tap((response: IApiResponse<IGlobalReservationModel>) => {
        if (response.status && response.data) {
          this.prepearPaymentsSection(response);
          this._updateReservationDetailsState({
            reservation: response.data,
            status: true,
            errorMessage: null // Clear any error on successful data retrieval
          });
          Logger.debug(`[ReservationDetailsFacade] Reservation details fetched successfully for ID: ${reservationId}`, response);

          // Store data in TransferState during SSR to avoid re-fetching on the client
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(RESERVATION_DETAILS_STATE_KEY, this._reservationDetailsState());
            Logger.debug('[ReservationDetailsFacade] Stored reservation details in TransferState for SSR');
          }
        } else {
          const errorMessage = response.message || this._localizationService.translateTextFromJson('reservation.errorLoadingDetails');
          this._updateReservationDetailsState({
            status: response.status, // Reflect the API's status
            errorMessage: errorMessage,
            reservation: null // Clear data on logical error
          });
          // this._toastService.error(errorMessage, 'Error Loading Reservation');
          Logger.warn(`[ReservationDetailsFacade] API reported an issue loading reservation ${reservationId}: ${errorMessage}`);
        }
      }),
      catchError((error: ApiError) => {
        // Handle network errors or unhandled server errors
        const localizedError = this._localizationService.translateTextFromJson('an_error_has_occurredOccurred');
        const errorMessage = error.message || localizedError;
        this._updateReservationDetailsState({
          status: false,
          errorMessage: errorMessage,
          reservation: null
        });
        handleApiErrors(error); // Use your centralized error handler
        // this._toastService.error(localizedError, 'Error');
        Logger.error(`[ReservationDetailsFacade] Failed to fetch reservation details for ID: ${reservationId}`, error);
        return EMPTY;
      }),
      finalize(() => {
        this._updateReservationDetailsState({ isLoading: false });
      })
    ).subscribe();
  }
  private prepearPaymentsSection(response: IApiResponse<IGlobalReservationModel>): void {
    if (!response.data) {
      Logger.warn('[ReservationDetailsFacade] No reservation data found in response to prepare payments section.');
      return;
    }

    // If payments object is completely missing or null, provide the full default structure
    if (!response.data.payments) {
      Logger.debug('[ReservationDetailsFacade] Payments section missing, injecting default mock data.');
      let discountValue: string = '';
      if (response.data?.coupon?.discount_type == 'percentage') {
        discountValue = `${response.data?.coupon?.discount}%`
      } else {
        discountValue = `${response.data?.coupon?.discount}`
      }
      response.data.payments = {
        "total": {
          "currency": "ر.س",
          "value": response.data.price_after ?? 0,
          "label": "total"
        },
        "payments": [
          {
            "currency": null,
            "value": response.data?.coupon?.coupon ?? '--',
            "label": "discount_code"
          },
          {
            "currency": response?.data?.coupon?.discount_type == 'percentage' ? null : "ر.س",
            "value": discountValue ?? '',
            "label": "discount"
          },
          {
            "currency": "ر.س",
            "value": response.data.price ?? 0,
            "label": "subtotal"
          },
          {
            "currency": null,
            "value": response.data.payment?.name ?? '',
            "label": "payment_method"
          },
          {
            "currency": "ر.س",
            "value": response.data.tax_amount ?? '',
            "label": "tax"
          }
        ]
      };
    }
  }

  resetReservationDetailsState(): void {
    this._reservationDetailsState.set(initialReservationDetailsState);
    Logger.debug('[ReservationDetailsFacade] Reservation details state reset.');
  }


  private _updateReservationDetailsState(updates: Partial<IReservationDetailsState>): void {
    this._reservationDetailsState.update(state => ({
      ...state,
      ...updates
    }));
  }
}
