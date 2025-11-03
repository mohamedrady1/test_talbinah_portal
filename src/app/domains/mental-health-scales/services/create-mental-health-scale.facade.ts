// src/app/features/mental-health-scales/services/create-mental-health-scale.facade.ts

import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common'; // Adjust path if needed
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared'; // Adjust path if needed

import { IMentalHealthScalesApiClient, MentalHealthScalesApiClientProvider } from '../clients';
import { CreateMentalHealthScaleState, initialCreateMentalHealthScaleState } from '../models';
import { ICreateMentalHealthScaleRequestDto, ICreateMentalHealthScaleResponseDto } from '../dtos';
import { MyMeasurementsFacade } from './my-measurements.facade';


// Define State Key for TransferState
const CREATE_SCALE_STATE_KEY = makeStateKey<CreateMentalHealthScaleState>('createMentalHealthScaleState');

@Injectable({
  providedIn: 'root',
})
export class CreateMentalHealthScaleFacade {
  // --- Dependencies ---
  private _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private MyMeasurementsFacade = inject(MyMeasurementsFacade)

  // --- Internal Feature State (Signal) ---
  private readonly _createScaleState = signal<CreateMentalHealthScaleState>(initialCreateMentalHealthScaleState);

  // --- Exposed Selectors (Computed Signals) ---
  readonly isCreatingScale = computed(() => this._createScaleState().isCreating);
  readonly createScaleSuccess = computed(() => this._createScaleState().createSuccess);
  readonly createScaleError = computed(() => this._createScaleState().createError);
  readonly createdScaleResponse = computed(() => this._createScaleState().createdScaleResponse);

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(CREATE_SCALE_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating create mental health scale state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(CREATE_SCALE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Initiates the creation of a new mental health scale.
   * Manages loading states, error handling, and success/failure indication.
   * @param payload The data to send for creating the scale.
   */
  createMentalHealthScale(payload: ICreateMentalHealthScaleRequestDto): void {
    Logger.debug('Attempting to create mental health scale with payload:', payload);

    this.updateState({
      isCreating: true,
      createSuccess: false, // Reset previous states
      createError: null,
      createdScaleResponse: null,
    });
    this._apiClient.CreateMentalHealthScale(payload)
      .pipe(
        tap((response: ICreateMentalHealthScaleResponseDto) => {
          if (response.status) { // Assuming 'status: true' indicates success
            this.updateState({
              createSuccess: true,
              createdScaleResponse: response,
              createError: null,
            });
            // Store in TransferState for SSR
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(CREATE_SCALE_STATE_KEY, this._createScaleState());
              Logger.debug('Stored create scale state in TransferState for SSR.');
            }
            // this._toastService.success(this._localizationService.translateTextFromJson('scales.createSuccess')); // New translation key
            Logger.debug('Mental health scale created successfully:', response);
            this.MyMeasurementsFacade.fetchMyMeasurements();
          } else {
            // Handle API-level business logic errors (e.g., message from backend)
            const errorMessage = response.message || this._localizationService.translateTextFromJson('scales.createFailedGeneric'); // New translation key
            this.handleError({ message: errorMessage } as ApiError, errorMessage);
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'an_error_has_occurredCreatingScale'); // New translation key
          return EMPTY; // Prevent stream from completing on error
        }),
        finalize(() => {
          this.finalizeCreation();
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the scale creation operation.
   * Call this after a successful creation or if you want to clear the error.
   */
  resetState(): void {
    this._createScaleState.set(initialCreateMentalHealthScaleState);
    Logger.debug('Create mental health scale state reset.');
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update the create scale state immutably.
   */
  private updateState(updates: Partial<CreateMentalHealthScaleState>): void {
    this._createScaleState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during scale creation and updates the state.
   */
  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error creating mental health scale:`, error);
    handleApiErrors(error);
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateState({
      createError: this._localizationService.translateTextFromJson(translationKey),
      createSuccess: false,
      createdScaleResponse: null,
    });
  }

  /**
   * Finalizes the scale creation operation by resetting loading state.
   */
  private finalizeCreation(): void {
    this.updateState({
      isCreating: false,
    });
    Logger.debug('Mental health scale creation finalized.');
  }

  /**
 * Clears success, error, and response for a fresh start.
 * Call this before initiating a new test.
 */
  resetCreateScaleState(): void {
    this._createScaleState.set({
      isCreating: false,
      createSuccess: false,
      createError: null,
      createdScaleResponse: null,
    });
    Logger.debug('Create mental health scale state manually reset.');
  }

}
