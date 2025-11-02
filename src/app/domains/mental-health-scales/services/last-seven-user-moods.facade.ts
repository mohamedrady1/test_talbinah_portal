import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared';

import { IMentalHealthScalesApiClient, MentalHealthScalesApiClientProvider } from '../clients';
import { initialLastSevenUserMoodsState, LastSevenUserMoodsState } from '../models';
import { ILastSevenUserMoodsResponseDto } from '../dtos';


// Define State Key for TransferState
const LAST_SEVEN_MOODS_STATE_KEY = makeStateKey<LastSevenUserMoodsState>('lastSevenUserMoodsState');

@Injectable({
  providedIn: 'root',
})
export class LastSevenUserMoodsFacade {
  // --- Dependencies ---
  private _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Signal) ---
  private readonly _sevenDayMoodsState = signal<LastSevenUserMoodsState>(initialLastSevenUserMoodsState);

  // --- Exposed Selectors (Computed Signals) ---
  readonly lastSevenUserMoods = computed(() => this._sevenDayMoodsState().response);
  readonly isLoadingLastSevenUserMoods = computed(() => this._sevenDayMoodsState().isLoading);
  readonly lastSevenUserMoodsErrorMessage = computed(() => this._sevenDayMoodsState().errorMessage);

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(LAST_SEVEN_MOODS_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating last seven user moods state from TransferState:', cachedState);
      //   this.updateState(cachedState);
      //   this._transferState.remove(LAST_SEVEN_MOODS_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---
  getLastSevenUserMoods(showLoader: boolean = true): void {
    Logger.debug('Fetching last seven user moods...');

    this.updateState({
      isLoading: showLoader, // Respect the showLoader parameter
      errorMessage: null,
    });

    this._apiClient.lastSevenUserMood()
      .pipe(
        tap((response: ILastSevenUserMoodsResponseDto) => {
          this.updateState({
            response: response,
            errorMessage: null,
            isLoading: false // Ensure loading is false on success
          });

          if (!response?.data?.length) {
            Logger.warn('No historical moods found or data is empty.');
          } else {
            Logger.debug('Last seven user moods fetched successfully:', response);
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(LAST_SEVEN_MOODS_STATE_KEY, this._sevenDayMoodsState());
          }
        }),
        catchError((error: ApiError) => {
          this.handleError(error, 'general.errorLoadingHistoricalMoods');
          return EMPTY;
        }),
        finalize(() => {
          if (this._sevenDayMoodsState().isLoading) {
            this.updateState({ isLoading: false });
          }
          Logger.debug('Last seven user moods fetch finalized.');
        })
      )
      .subscribe();
  }

  resetState(): void {
    this._sevenDayMoodsState.set(initialLastSevenUserMoodsState);
    Logger.debug('Last seven user moods state reset.');
  }
  resetLastSevenUserMoodsState(): void {
    this._sevenDayMoodsState.update(currentState => ({
      ...currentState,
      response: null,
      errorMessage: null,
      isLoading: false
    }));
    Logger.debug('Last seven user moods state reset.');
  }
  // --- Private Utility Methods for State Management ---

  private updateState(updates: Partial<LastSevenUserMoodsState>): void {
    this._sevenDayMoodsState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  private handleError(error: ApiError, translationKey: string): void {
    Logger.error(`Error fetching last seven user moods:`, error);
    handleApiErrors(error);
    this.updateState({
      errorMessage: this._localizationService.translateTextFromJson(translationKey),
      response: null
    });
  }

  private finalizeFetch(): void {
    this.updateState({
      isLoading: false,
    });
    Logger.debug('Last seven user moods fetch finalized.');
  }
}
