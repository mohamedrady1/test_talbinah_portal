// app/core/store/appointments/schedule-reservation.facade.ts

import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger, NavigationIntent, NavigationService } from '../../../common';
import { LocalizationService, ModalService, ToastService } from '../../../shared'; // Adjust paths as necessary
import { INormalPackagesReservationResponseDto, IStoreNormalPackagesReservationRequestDto } from '../dtos';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { AppointmentsRoutesEnum } from '../constants';

export interface INormalPackagesReservationState {
  isStoring: boolean;
  isSuccess: boolean;
  storingError: string | null;
  successMessage: string | null;
  NormalPackagesReservationResponse: INormalPackagesReservationResponseDto['data'] | null; // Stores the 'data' part of the response
}

/**
 * @constant initialNormalPackagesReservationState
 * @description Initial state for the reservation scheduling process.
 */
export const initialNormalPackagesReservationState: INormalPackagesReservationState = {
  isStoring: false,
  isSuccess: false,
  storingError: null,
  successMessage: null,
  NormalPackagesReservationResponse: null,
};

// Define a unique state key for Angular's TransferState for SSR hydration
const NORMAL_PACKAGES_RESERVATION_STATE_KEY = makeStateKey<INormalPackagesReservationState>('NormalPackagesReservationState');

@Injectable({
  providedIn: 'root',
})
export class NormalPackagesReservationFacade {
  // --- Dependencies Injected ---
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private readonly modalService = inject(ModalService);
  private readonly nav = inject(NavigationService);
  // --- Internal Feature State (Managed by a Signal) ---
  private readonly _NormalPackagesReservationState = signal<INormalPackagesReservationState>(initialNormalPackagesReservationState);

  // --- Exposed Selectors (Computed Signals for Public Consumption) ---
  readonly isStoring = computed(() => this._NormalPackagesReservationState().isStoring);
  readonly isSuccess = computed(() => this._NormalPackagesReservationState().isSuccess);
  readonly successMessage = computed(() => this._NormalPackagesReservationState().successMessage);
  readonly storingError = computed(() => this._NormalPackagesReservationState().storingError);
  readonly storedNormalPackagesReservation = computed(() => this._NormalPackagesReservationState().NormalPackagesReservationResponse);

  constructor() {
    // Attempt to hydrate the state from TransferState when running in the browser
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(NORMAL_PACKAGES_RESERVATION_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating normal packages reservation state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(NORMAL_PACKAGES_RESERVATION_STATE_KEY); // Remove after hydration
      // }
    }
  }

  // --- Public Action Methods ---
  storeNormalPackagesReservation(payload: IStoreNormalPackagesReservationRequestDto, typeId: string | null = null): void {
    Logger.debug(`Attempting to normal packages reservation with payload:`, payload);

    // Optimistically update state to indicate loading and clear previous outcomes
    this.updateState({
      isStoring: true,
      isSuccess: false,
      storingError: null,
      NormalPackagesReservationResponse: null,
    });

    this._apiClient.StoreNormalPackagesReservation(payload)
      .pipe(
        tap((response: INormalPackagesReservationResponseDto) => {
          if (response.status) {
            if (payload.payment_id === 1) {
              this.modalService.closeAll();
            }

            // Update state with successful response data
            this.updateState({
              isSuccess: true,
              successMessage: response.message,
              NormalPackagesReservationResponse: response.data || null, // Store the 'data' part, or null
              storingError: null,
            });
            // Store the current state in TransferState during SSR (on the server)
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(NORMAL_PACKAGES_RESERVATION_STATE_KEY, this._NormalPackagesReservationState());
              Logger.debug('Stored normal packages reservation state in TransferState for SSR.');
            }
            // this._toastService.success(response.message || this._localizationService.translateTextFromJson('appointments.isSuccess'));
            Logger.debug(`Reservation stored successfully:`, response.data);
          } else {
            // Handle API-level business logic errors
            const errorMessage = response.message || this._localizationService.translateTextFromJson('appointments.scheduleFailedGeneric');
            this.updateState({
              isSuccess: false,
              NormalPackagesReservationResponse: response.data || null,
              storingError: errorMessage,
            });
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
          this.nav.navigate(NavigationIntent.INTERNAL, AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE, typeId ? { typeId } : undefined);
        }),
        catchError((error: ApiError) => {
          // Catch and handle HTTP or network errors
          this.handleError(error, 'general.errorSchedulingReservation');
          return EMPTY; // Prevent the observable stream from completing with an error
        }),
        finalize(() => {
          // Always finalize by resetting the loading state
          this.finalizeScheduleOperation();
        })
      )
      .subscribe(); // Subscribe to execute the observable
  }

  /**
   * Resets the entire scheduling state to its initial values.
   */
  resetState(): void {
    this._NormalPackagesReservationState.set(initialNormalPackagesReservationState);
    Logger.debug('normal packages reservation state reset.');
  }

  // --- Private Utility Methods for Internal State Management ---
  private updateState(updates: Partial<INormalPackagesReservationState>): void {
    this._NormalPackagesReservationState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error normal packages reservation:`, error);
    handleApiErrors(error); // Call your common error handler
    // this._toastService.error(error?.message ?? this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      storingError: error?.message ?? this._localizationService.translateTextFromJson(translationKey),
      isSuccess: false,
      NormalPackagesReservationResponse: null,
    });
  }

  /**
   * Finalizes the schedule operation by setting the loading state to false.
   */
  private finalizeScheduleOperation(): void {
    this.updateState({
      isStoring: false,
    });
    Logger.debug('normal packages reservation operation finalized.');
  }

  /**
   * Specifically clears success, error, and response data for a fresh start
   * without resetting the entire facade state.
   */
  resetNormalPackagesOperationState(): void {
    this._NormalPackagesReservationState.set({
      isStoring: false,
      isSuccess: false,
      storingError: null,
      successMessage: null,
      NormalPackagesReservationResponse: null,
    });
    Logger.debug('normal packages reservation operation state manually reset.');
  }
}
