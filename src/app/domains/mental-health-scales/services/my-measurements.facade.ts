// src/app/features/mental-health-scales/facades/my-measurements.facade.ts
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
import {
  Logger,
  ApiError,
  handleApiErrors,
} from '../../../common'; // Adjust path to common module
import { ToastService, LocalizationService } from '../../../shared'; // Adjust path to shared module
import { UserContextService } from '../../authentication'; // Add UserContextService import

import { IMentalHealthScalesApiClient, MentalHealthScalesApiClientProvider } from '../clients'; // Re-using existing client
import { initialMyMeasurementsListState, MyMeasurementsListState } from '../models';
import { IMyMentalHealthScalesResponseDto } from '../dtos';

const MY_MEASUREMENTS_STATE_KEY = makeStateKey<MyMeasurementsListState>('myMeasurementsState');

@Injectable({
  providedIn: 'root'
})
export class MyMeasurementsFacade {
  // --- Dependencies ---
  // Using the existing MentalHealthScalesApiClient to fetch measurements
  private readonly _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _UserContextService = inject(UserContextService);

  // --- Feature State (Signal) ---
  private readonly _state = signal<MyMeasurementsListState>(initialMyMeasurementsListState);

  // --- Selectors (Computed Signals) ---
  readonly myMeasurements = computed(() => this._state().measurements);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly status = computed(() => this._state().status); // 'idle' | 'loading' | 'success' | 'error'

  constructor() {
    // Attempt to hydrate state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<MyMeasurementsListState>(
      //   MY_MEASUREMENTS_STATE_KEY,
      //   initialMyMeasurementsListState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating my measurements from TransferState:', cachedState);
      //   this._updateState(cachedState);
      //   this._transferState.remove(MY_MEASUREMENTS_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Fetches the user's personal measurements.
   * Manages loading states, error handling, and success/failure indication.
   */
  fetchMyMeasurements(): void {
    Logger.debug('Fetching my measurements...');

    // Set initial loading state
    this._updateState({
      isLoading: true,
      errorMessage: null,
      status: 'loading',
    });

    // Check TransferState for cached data on the browser side
    // const cached = this._transferState.get<MyMeasurementsListState>(
    //   MY_MEASUREMENTS_STATE_KEY,
    //   null as any
    // );

    // if (isPlatformBrowser(this._platformId) && cached && cached.measurements.length > 0) {
    //   Logger.debug('Using cached my measurements from TransferState.');
    //   this._updateState({
    //     measurements: cached.measurements,
    //     isLoading: false,
    //     errorMessage: null,
    //     status: 'success',
    //   });
    //   this._transferState.remove(MY_MEASUREMENTS_STATE_KEY);
    //   return;
    // }

    // Perform API call
    this._apiClient.MyMentalHealthScalesListing()
      .pipe(
        tap((response: IMyMentalHealthScalesResponseDto) => {
          if (response && response.status && response.data?.length > 0) {
            this._updateState({
              measurements: response.data,
              errorMessage: null,
              status: 'success',
            });
            Logger.debug('My measurements fetched successfully:', response.data);
          } else {
            this._updateState({
              measurements: [],
              errorMessage: this._localizationService.translateTextFromJson('measurements.emptyState'), // New translation key
              status: 'success', // Still success, but no data found
            });
            Logger.debug('No my measurements found or API status was false.');
          }

          // Store state in TransferState during SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(MY_MEASUREMENTS_STATE_KEY, this._state());
            Logger.debug('Stored my measurements state in TransferState for SSR.');
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error fetching my measurements:', error);
          handleApiErrors(error); // Common error handling for toasts/logging
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: error?.message || this._localizationService.translateTextFromJson('measurements.errorLoading'), // New translation key
            life: 5000
          });
          this._updateState({
            measurements: [],
            errorMessage: error?.message || this._localizationService.translateTextFromJson('measurements.errorLoading'),
            status: 'error',
          });
          return EMPTY; // Terminate the observable stream gracefully
        }),
        finalize(() => {
          // Reset loading state after operation completes (success or error)
          this._updateState({ isLoading: false });
          Logger.debug('My measurements fetch finalized.');
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the my measurements operation.
   * Call this to clear previous data, errors, or loading states.
   */
  resetState(): void {
    this._state.set(initialMyMeasurementsListState);
    Logger.debug('My measurements state has been reset.');
  }

  // --- Private Utility Method for State Management ---

  /**
   * Utility to update the measurements list state immutably.
   * @param updates Partial state updates to apply.
   */
  private _updateState(updates: Partial<MyMeasurementsListState>): void {
    this._state.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }
}
