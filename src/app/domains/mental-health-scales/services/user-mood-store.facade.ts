import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common'; // Adjust path if needed
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared'; // Adjust path if needed

// Import state model for mood storage
import { MoodStoreState, initialMoodStoreState } from '../models/mood-store-state.model';

// Import DTOs for storing user mood
import { IMentalHealthScalesApiClient, MentalHealthScalesApiClientProvider } from '../clients';
import { IStoreUserMoodRequestDto, IStoreUserMoodResponseDto } from '../dtos';
import { LastSevenUserMoodsFacade } from './last-seven-user-moods.facade';


// Define State Key for TransferState for the mood storage operation
const MOOD_STORE_STATE_KEY = makeStateKey<MoodStoreState>('moodStoreState');

@Injectable({
  providedIn: 'root',
})
export class UserMoodStoreFacade {
  // --- Dependencies ---
  private _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  protected readonly _lastSevenMoodsFacade = inject(LastSevenUserMoodsFacade);

  // --- Internal Feature State (Signal) ---
  private readonly _moodStoreState = signal<MoodStoreState>(initialMoodStoreState);

  // --- Exposed Selectors (Computed Signals) for the Mood Storage Operation ---
  readonly isStoringMood = computed(() => this._moodStoreState().isStoring);
  readonly storeMoodSuccess = computed(() => this._moodStoreState().storeSuccess);
  readonly storeMoodError = computed(() => this._moodStoreState().storeError);
  readonly storedMoodResponse = computed(() => this._moodStoreState().storedMoodResponse);

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedStoreState = this._transferState.get(MOOD_STORE_STATE_KEY, null);
      // if (cachedStoreState) {
      //   Logger.debug('Hydrating mood store state from TransferState:', cachedStoreState);
      //   this.updateMoodStoreState(cachedStoreState);
      //   this._transferState.remove(MOOD_STORE_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Stores a user's selected mood.
   * Manages loading states, error handling, and success/failure indication.
   * @param payload The data to send for storing the mood.
   */
  storeUserMood(payload: IStoreUserMoodRequestDto): void {
    Logger.debug('Storing user mood with payload:', payload);

    this.updateMoodStoreState({
      isStoring: true,
      storeSuccess: false, // Reset previous success/error states
      storeError: null,
      storedMoodResponse: null,
    });

    this._apiClient.storeUserMood(payload)
      .pipe(
        tap((response: IStoreUserMoodResponseDto) => {
          if (response.status) { // Assuming 'status: true' indicates success
            this.updateMoodStoreState({
              storeSuccess: true,
              storedMoodResponse: response,
              storeError: null,
            });
            // Store in TransferState for SSR
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(MOOD_STORE_STATE_KEY, this._moodStoreState());
              Logger.debug('Stored mood store state in TransferState for SSR.');
            }
            // this._toastService.success(this._localizationService.translateTextFromJson('moods.storeSuccess'));
            Logger.debug('User mood stored successfully:', response);
          } else {
            // Handle API-level business logic errors (e.g., message from backend)
            const errorMessage = response.message || this._localizationService.translateTextFromJson('moods.storeFailedGeneric');
            this.handleMoodStoreError({ message: errorMessage } as ApiError, errorMessage); // Use object literal if ApiError is a type
          }
        }),
        catchError((error: ApiError) => {
          this.handleMoodStoreError(error, 'an_error_has_occurredStoringMood');
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeMoodStore();
          this._lastSevenMoodsFacade.getLastSevenUserMoods(true);
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the mood storage operation.
   * Call this after a successful store or if you want to clear the error.
   */
  resetMoodStoreState(): void {
    this._moodStoreState.set(initialMoodStoreState);
    Logger.debug('Mood store state reset.');
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update the mood store state immutably.
   */
  private updateMoodStoreState(updates: Partial<MoodStoreState>): void {
    this._moodStoreState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during mood storage and updates the state.
   */
  private handleMoodStoreError(error: ApiError, translationKey: string): void {
    Logger.error(`Error storing user mood:`, error);
    handleApiErrors(error); // Common API error handling
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateMoodStoreState({
      storeError: this._localizationService.translateTextFromJson(translationKey),
      storeSuccess: false,
      storedMoodResponse: null,
    });
  }

  /**
   * Finalizes the mood store operation by resetting loading state.
   */
  private finalizeMoodStore(): void {
    this.updateMoodStoreState({
      isStoring: false,
    });
    Logger.debug('Mood store operation finalized.');
  }
}
