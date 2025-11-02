import {
  inject,
  Injectable,
  signal,
  computed,
  effect,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
  isSignal,
  Signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, EMPTY, catchError, finalize, tap } from 'rxjs';

import {
  IUrgentAppointmentApiClient,
  UrgentAppointmentApiClientProvider
} from '../clients';
import {
  ICheckEmergencyAppointmentReservationResponseDto,
  ICheckReservationEmergencyParamsDto
} from '../dtos';
import {
  ICheckReservationEmergencyState,
  initialCheckReservationEmergencyState
} from '../models';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { LocalizationService, ToastService } from '../../../shared';

const CHECK_RESERVATION_EMERGENCY_STORE_STATE_KEY =
  makeStateKey<ICheckReservationEmergencyState>('CheckReservationEmergencyState');

@Injectable({
  providedIn: 'root',
})
export class checkReservationRequestFacade {
  _openUrgentAppointmentWindow$ = new BehaviorSubject<OpenUrgentAppointmentWindowState | null>(null);

  // Dependencies
  private readonly _apiClient = inject(UrgentAppointmentApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // State signal
  private readonly _state = signal<ICheckReservationEmergencyState>(
    initialCheckReservationEmergencyState
  );

  // Countdown logic
  private _remainingSeconds = signal(0);
  private _pollingInterval: any;
  private _pollingActive = signal(false);
  private _hasStartedCountdown = false;
  private readonly COUNTDOWN_INTERVAL = 5;

  // NEW SIGNAL: To inform the component when a new request is triggered
  private _isNewRequestTriggered = signal(false);

  // NEW SIGNAL: To prevent floating window when search waiting doctor modal is open
  private _isSearchWaitingDoctorOpen = signal(false);


  // Computed public selectors
  readonly isCheckEmergencyAppointment = computed(() => this._state().isStoring);
  readonly checkSuccess = computed(() => this._state().storeSuccess);
  readonly checkError = computed(() => this._state().storeError);
  readonly before_request = computed(() => this._state().before_request);
  readonly checkedEmergencyAppointment = computed(() => this._state().storedCheckReservationResponse);
  readonly remainingSeconds = computed(() => this._remainingSeconds());
  readonly isNewRequestTriggered = computed(() => this._isNewRequestTriggered()); // Expose the new signal
  readonly isSearchWaitingDoctorOpen = computed(() => this._isSearchWaitingDoctorOpen()); // Expose the search waiting doctor state

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cached = this._transferState.get(CHECK_RESERVATION_EMERGENCY_STORE_STATE_KEY, null);
      // if (cached) {
      //   this._state.set(cached);
      //   this._transferState.remove(CHECK_RESERVATION_EMERGENCY_STORE_STATE_KEY);
      // }
    }

    // Facade's effect for handling response and countdown logic
    effect(() => {
      const response = this.checkedEmergencyAppointment();
      const success = this.checkSuccess();
      const error = this.checkError();

      if (error) {
        Logger.error('❌ Facade Effect: Error:', error);
        return;
      }

      if (!success) return; // Only proceed if the check was successful

      const remainingTime = response?.remaining_time ?? 0;

      if (!response) {
        // This case should ideally not happen if success is true, but as a safeguard.
        if (remainingTime > 0) {
          Logger.debug('⏳ Facade Effect: No response, but remaining > 0 → countdown');
          this.startCountdown(remainingTime);
        } else {
          Logger.debug('📭 Facade Effect: No response, remaining <= 0 → stop');
          this._remainingSeconds.set(0);
          this.stopCountdown();
        }
        return;
      }

      if (response.reservation?.id) {
        Logger.debug('✅ Facade Effect: Reservation exists. Stop countdown.');
        this._remainingSeconds.set(0);
        this.stopCountdown();
        return;
      }

      if (!response.reservation && remainingTime > 0) {
        Logger.debug('⏳ Facade Effect: No reservation, remaining > 0 → countdown');
        this.startCountdown(remainingTime);

        // Only open urgent appointment window if search waiting doctor modal is not open
        if (!this._isSearchWaitingDoctorOpen()) {
          this._openUrgentAppointmentWindow$.next({
            isOpen: true,
            remaining_time: remainingTime
          });
          Logger.debug('🪟 Facade Effect: Opening urgent appointment window with remaining time:', remainingTime);
        } else {
          Logger.debug('🚫 Facade Effect: Search waiting doctor modal is open, preventing floating window from opening');
        }
      } else if (!response.reservation && remainingTime <= 0) {
        Logger.debug('📭 Facade Effect: No reservation and no time left → stop countdown');
        this._remainingSeconds.set(0);
        this.stopCountdown();
      }
    });

    // Effect to start/stop polling based on _pollingActive signal
    effect(() => {
      if (this._pollingActive()) {
        Logger.debug('🔄 Facade Effect: Polling active, starting poll interval.');
        this.startPolling();
      } else {
        Logger.debug('🛑 Facade Effect: Polling inactive, stopping poll interval.');
        this.stopPolling();
      }
    });
  }

  checkEmergencyAppointmentReservation(params: ICheckReservationEmergencyParamsDto): void {
    Logger.debug('📡 Facade: API request initiated with:', params);

    // Set the new request triggered flag *before* initiating the API call
    this._isNewRequestTriggered.set(true);

    this.updateState({
      isStoring: true,
      storeSuccess: false,
      storeError: null,
      storedCheckReservationResponse: null,
    });

    this._apiClient.checkEmergencyAppointmentReservation(params)
      .pipe(
        tap((res: ICheckEmergencyAppointmentReservationResponseDto) => {
          if (res.status) {
            this.updateState({
              storeSuccess: true,
              before_request: params.before_request,
              storedCheckReservationResponse: res.data ?? null,
              storeError: null,
            });

            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(
                CHECK_RESERVATION_EMERGENCY_STORE_STATE_KEY,
                this._state()
              );
            }
          } else {
            const msg = res.message || this._localizationService.translateTextFromJson('EmergencyAppointments.storeFailedGeneric');
            this.handleError({ message: msg } as ApiError, msg);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'general.errorCheckEmergencyAppointment');
          return EMPTY;
        }),
        finalize(() => {
          this.updateState({ isStoring: false });
          // No need to reset _isNewRequestTriggered here, the component will do it after acknowledging.
        })
      )
      .subscribe();
  }

  // NEW METHOD: To allow the component to acknowledge that it's seen the new request trigger
  acknowledgeNewRequest(): void {
    Logger.debug('Facade: Component acknowledged new request. Resetting isNewRequestTriggered.');
    this._isNewRequestTriggered.set(false);
  }

  // NEW METHODS: To manage search waiting doctor modal state
  setSearchWaitingDoctorOpen(isOpen: boolean): void {
    Logger.debug('Facade: Setting search waiting doctor modal state:', isOpen);
    this._isSearchWaitingDoctorOpen.set(isOpen);
  }

  startCountdown(seconds: number): void {
    this._remainingSeconds.set(seconds);
    if (!this._hasStartedCountdown) {
      this._hasStartedCountdown = true;
      this._pollingActive.set(true); // Activate polling if not already
    }
  }

  stopCountdown(): void {
    this._hasStartedCountdown = false;
    this._pollingActive.set(false); // Deactivate polling
    this._remainingSeconds.set(0);
  }

  private startPolling(): void {
    this.stopPolling(); // Clear any existing interval before starting a new one

    this._pollingInterval = setInterval(() => {
      const secondsLeft = this._remainingSeconds();
      if (secondsLeft <= 0) {
        Logger.debug('Facade Polling: Countdown reached 0, stopping polling.');
        this.stopCountdown();
        return;
      }

      const next = Math.max(0, secondsLeft - this.COUNTDOWN_INTERVAL);
      this._remainingSeconds.set(next);

      // Trigger a new check, which will set _isNewRequestTriggered in the facade
      this.checkEmergencyAppointmentReservation({ before_request: false });

    }, this.COUNTDOWN_INTERVAL * 1000);
  }

  private stopPolling(): void {
    if (this._pollingInterval) {
      clearInterval(this._pollingInterval);
      this._pollingInterval = undefined;
    }
  }

  resetState(): void {
    this._state.set(initialCheckReservationEmergencyState);
    this.stopCountdown();
    this._isNewRequestTriggered.set(false); // Ensure this is also reset
    this._isSearchWaitingDoctorOpen.set(false); // Reset search waiting doctor state
    Logger.debug('🧹 Facade State reset');
  }

  resetStoreOperationState(): void {
    this._state.set({
      isStoring: false,
      storeSuccess: false,
      storeError: null,
      storedCheckReservationResponse: null,
    });
    Logger.debug('🔄 Facade: Store operation state manually reset.');
    // No need to reset _isNewRequestTriggered here, as resetState covers it.
  }

  // NEW METHOD: Check reservation on app startup
  checkReservationOnStartup(): void {
    Logger.debug('🚀 Facade: Checking reservation on app startup');

    // Call the API with before_request: true to check initial state
    this.checkEmergencyAppointmentReservation({ before_request: true });
  }

  private updateState(updates: Partial<ICheckReservationEmergencyState>): void {
    this._state.update(curr => ({ ...curr, ...updates }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`❌ Facade error:`, error);
    handleApiErrors(error);
    this.updateState({
      storeError: this._localizationService.translateTextFromJson(translationKey),
      storeSuccess: false,
      storedCheckReservationResponse: null,
    });
  }
}

export interface OpenUrgentAppointmentWindowState {
  isOpen: boolean;
  remaining_time?: number;
}

