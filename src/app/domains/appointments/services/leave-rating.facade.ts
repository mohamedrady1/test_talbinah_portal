import { inject, Injectable, PLATFORM_ID, signal, computed, makeStateKey, TransferState, } from '@angular/core';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { AppointmentsApiClientProvider, IAppointmentsApiClient } from '../clients';
import { ILeaveRatingRequestDto, ILeaveRatingResponseDto, } from '../dtos';
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';

const LEAVE_RATING_STATE_KEY = makeStateKey<ILeaveRatingState>('leaveRatingState');

export interface ILeaveRatingState {
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  ratingResponse: ILeaveRatingResponseDto['data'] | null;
}

const initialLeaveRatingState: ILeaveRatingState = {
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  ratingResponse: null,
};

@Injectable({ providedIn: 'root' })
export class LeaveRatingFacade {
  private readonly _apiClient: IAppointmentsApiClient = inject(AppointmentsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localization = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _leaveRatingState = signal<ILeaveRatingState>(initialLeaveRatingState);

  readonly isSubmitting = computed(() => this._leaveRatingState().isSubmitting);
  readonly submitSuccess = computed(() => this._leaveRatingState().submitSuccess);
  readonly submitError = computed(() => this._leaveRatingState().submitError);
  readonly ratingResponse = computed(() => this._leaveRatingState().ratingResponse);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(LEAVE_RATING_STATE_KEY, null);
      // if (cachedState) {
      //   this.updateState(cachedState);
      //   this._transferState.remove(LEAVE_RATING_STATE_KEY);
      // }
    }
  }

  submitRating(id: number, payload: ILeaveRatingRequestDto): void {
    this.updateState({
      isSubmitting: true,
      submitSuccess: false,
      submitError: null,
      ratingResponse: null,
    });

    this._apiClient.LeaveRatingById(id, payload)
      .pipe(
        tap((response: ILeaveRatingResponseDto) => {
          if (response.status) {
            this.updateState({
              submitSuccess: true,
              ratingResponse: response.data ?? null,
              submitError: null,
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(LEAVE_RATING_STATE_KEY, this._leaveRatingState());
            }

            Logger.debug(`Rating submitted for reservation ${id}:`, response.data);

            this._toastService.add({
              severity: 'success',
              summary: this._localization.translateTextFromJson('general.success'),
              detail: response.message || this._localization.translateTextFromJson('appointments.ratingSubmitted'),
              life: 5000,
            });
          } else {
            const message = response.message || this._localization.translateTextFromJson('appointments.ratingFailedGeneric');
            this.handleError({ message } as ApiError, message);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'general.errorSubmittingRating');
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeSubmitOperation();
        })
      )
      .subscribe();
  }

  resetState(): void {
    this._leaveRatingState.set(initialLeaveRatingState);
  }

  resetSubmitOperationState(): void {
    this._leaveRatingState.set({
      isSubmitting: false,
      submitSuccess: false,
      submitError: null,
      ratingResponse: null,
    });
  }

  private updateState(updates: Partial<ILeaveRatingState>): void {
    this._leaveRatingState.update(state => ({
      ...state,
      ...updates,
    }));
  }

  private finalizeSubmitOperation(): void {
    this.updateState({ isSubmitting: false });
  }

  private handleError(error: ApiError, fallbackKey: string): void {
    Logger.error('Error submitting rating:', error);
    handleApiErrors(error);

    const errorMessage = error?.message || this._localization.translateTextFromJson(fallbackKey);

    this._toastService.add({
      severity: 'error',
      summary: this._localization.translateTextFromJson('general.error'),
      detail: errorMessage,
      life: 5000,
    });

    this.updateState({
      submitError: errorMessage,
      submitSuccess: false,
      ratingResponse: null,
    });
  }
}
