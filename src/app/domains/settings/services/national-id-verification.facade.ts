import { inject, Injectable, signal, computed } from '@angular/core';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { Logger, ApiError, handleApiErrors } from '../../../common'; // Assuming common utilities
import { LocalizationService, ToastService } from '../../../shared'; // Assuming shared services
import { IVerifyNationalIdRequest, IVerifyNationalIdResponse } from '../dtos';
import { ISettingsApiClient, SettingsApiClientProvider } from '../clients';


/**
 * Represents the state of the national ID verification operation.
 */
interface NationalIdVerificationState {
  isLoading: boolean;
  response: IVerifyNationalIdResponse | null;
  errorMessage: string | null;
  lastVerificationAttempt: IVerifyNationalIdRequest | null; // Stores the last request payload
}

/**
 * Initial state for the national ID verification facade.
 */
const initialNationalIdVerificationState: NationalIdVerificationState = {
  isLoading: false,
  response: null,
  errorMessage: null,
  lastVerificationAttempt: null,
};

@Injectable({ providedIn: 'root' })
export class NationalIdVerificationFacade {
  // --- Dependencies ---
  private readonly _apiClient: ISettingsApiClient = inject(SettingsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  // --- Internal Feature State (Signal) ---
  private readonly _state = signal<NationalIdVerificationState>(initialNationalIdVerificationState);

  // --- Exposed Selectors (Computed Signals) ---
  readonly isLoading = computed(() => this._state().isLoading);
  readonly verificationResponse = computed(() => this._state().response);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly lastVerificationAttempt = computed(() => this._state().lastVerificationAttempt);
  readonly isVerified = computed(() => this._state().response?.status === true && this._state().response?.data?.verify_national_id === 1);
  readonly isUnverified = computed(() => this._state().response?.status === true && this._state().response?.data?.verify_national_id === 0);

  /**
   * Triggers the national ID verification process.
   * Updates loading state, handles API calls, and provides user feedback.
   *
   * @param nationalId The national ID to verify.
   * @param birthDate The birth date to verify (YYYY-MM-DD).
   * @returns An Observable that completes when the operation is done.
   */
  verifyNationalIdAction(payload: IVerifyNationalIdRequest): Observable<IVerifyNationalIdResponse> {
    Logger.debug(`NationalIdVerificationFacade: Attempting to verify national ID: ${payload.national_id}, birth date: ${payload.birth_date}`);

    const requestPayload: IVerifyNationalIdRequest = payload;

    // Update state to reflect loading
    this._state.set({
      ...initialNationalIdVerificationState, // Reset previous state
      isLoading: true,
      lastVerificationAttempt: requestPayload,
      errorMessage: null, // Clear any previous errors
    });
    Logger.debug(`NationalIdVerificationFacade: requestPayload: `, requestPayload);

    return this._apiClient.verifyNationalId(requestPayload).pipe(
      tap((response: IVerifyNationalIdResponse) => {
        if (response?.status) {
          Logger.debug('NationalIdVerificationFacade: Verification successful:', response);
          // this._toastService.add({
          //   severity: 'success',
          //   summary: this._localizationService.translateTextFromJson('general.success'),
          //   detail: response?.message || this._localizationService.translateTextFromJson('profile.nationalIdVerifiedSuccessfully'),
          //   life: 5000,
          // });
          this._state.update(state => ({
            ...state,
            response: response,
            errorMessage: null,
          }));
        } else {
          // API call succeeded, but backend reported a business logic failure (e.g., status: false)
          const message = response?.message || this._localizationService.translateTextFromJson('profile.nationalIdVerificationFailed');
          Logger.warn('NationalIdVerificationFacade: Verification failed (API reported status: false):', message, response);
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: message,
            life: 5000,
          });
          this._state.update(state => ({
            ...state,
            response: response, // Keep the response, but signal error
            errorMessage: message,
          }));
        }
      }),
      catchError((error: ApiError) => {
        const message = error?.message || this._localizationService.translateTextFromJson('profile.nationalIdVerificationError');
        Logger.error('NationalIdVerificationFacade: Error during verification API call:', error);
        handleApiErrors(error); // Generic API error handling
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('general.error'),
          detail: message,
          life: 5000,
        });
        this._state.update(state => ({
          ...state,
          response: null, // Clear response on network/system error
          errorMessage: message,
        }));
        return EMPTY; // Prevent re-throwing the error to the subscriber
      }),
      finalize(() => {
        // Always reset loading state when the observable completes or errors
        this._state.update(state => ({ ...state, isLoading: false }));
        Logger.debug('NationalIdVerificationFacade: Verification process finalized.');
      })
    );
  }

  /**
   * Resets the entire verification state to its initial values.
   * Useful for clearing previous results when navigating away or after a successful operation.
   */
  resetState(): void {
    this._state.set(initialNationalIdVerificationState);
    Logger.debug('NationalIdVerificationFacade: State reset.');
  }
}
