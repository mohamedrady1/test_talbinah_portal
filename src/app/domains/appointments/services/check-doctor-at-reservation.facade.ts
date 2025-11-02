import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';

import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';
import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { IGlobalReservationModel } from '../models';


export interface ICheckDoctorAtReservationResponseDto {
  status: boolean;
  data?: IGlobalReservationModel | null;
  message?: string | null;
}

export interface ICheckDoctorAtReservationState {
  isChecking: boolean;
  checkSuccess: boolean;
  response: ICheckDoctorAtReservationResponseDto | null;
  checkError: string | null;
  isDoctorAssigned: boolean | null;
  status: boolean | null;
}

const initialCheckDoctorAtReservationState: ICheckDoctorAtReservationState = {
  isChecking: false,
  checkSuccess: false,
  response: null,
  checkError: null,
  isDoctorAssigned: null,
  status: null,
};

const CHECK_RESERVATION_STATE_KEY = makeStateKey<ICheckDoctorAtReservationState>('CheckDoctorAtReservationState');

@Injectable({ providedIn: 'root' })
export class CheckDoctorAtReservationFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _CheckDoctorAtReservationState = signal<ICheckDoctorAtReservationState>(initialCheckDoctorAtReservationState);

  readonly response = computed(() => this._CheckDoctorAtReservationState().response);
  readonly isChecking = computed(() => this._CheckDoctorAtReservationState().isChecking);
  readonly checkSuccess = computed(() => this._CheckDoctorAtReservationState().checkSuccess);
  readonly status = computed(() => this._CheckDoctorAtReservationState().status);
  readonly checkError = computed(() => this._CheckDoctorAtReservationState().checkError);
  readonly isDoctorAssigned = computed(() => this._CheckDoctorAtReservationState().isDoctorAssigned);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CHECK_RESERVATION_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating check reservation state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CHECK_RESERVATION_STATE_KEY);
      // }
    }
  }

  checkDoctorAtReservation(reservationId: number): void {
    Logger.debug(`Checking if doctor is assigned to reservation ${reservationId}`);

    this.updateState({
      isChecking: true,
      checkSuccess: false,
      checkError: null,
      isDoctorAssigned: null,
    });

    this._apiClient.CheckDoctorAtReservation(reservationId)
      .pipe(
        tap((response: ICheckDoctorAtReservationResponseDto) => {
          if (response.status) {
            this.updateState({
              checkSuccess: true,
              isDoctorAssigned: !!(response.data && response.data.is_start === 1),
              checkError: null,
              response: response,
              status: response.status
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CHECK_RESERVATION_STATE_KEY, this._CheckDoctorAtReservationState());
            }

            Logger.debug(`Reservation ${reservationId} doctor check:`, response.data);
          } else {
            const errorMessage = response.message || this._localizationService.translateTextFromJson('appointments.checkFailedGeneric');
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'general.errorCheckingReservation');
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeCheckOperation();
        })
      )
      .subscribe();
  }

  resetState(): void {
    this._CheckDoctorAtReservationState.set(initialCheckDoctorAtReservationState);
  }

  resetCheckOperationState(): void {
    this._CheckDoctorAtReservationState.set({
      isChecking: false,
      checkSuccess: false,
      checkError: null,
      isDoctorAssigned: null,
      response: null,
      status: null,
    });
  }

  private updateState(updates: Partial<ICheckDoctorAtReservationState>): void {
    this._CheckDoctorAtReservationState.update(state => ({ ...state, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error('Error checking reservation:', error);
    handleApiErrors(error);

    const message = error?.message ?? this._localizationService.translateTextFromJson(translationKey);

    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('general.error'),
      detail: message,
      life: 5000,
    });

    this.updateState({
      checkError: message,
      checkSuccess: false,
      isDoctorAssigned: null,
    });
  }

  private finalizeCheckOperation(): void {
    this.updateState({ isChecking: false });
  }
}
