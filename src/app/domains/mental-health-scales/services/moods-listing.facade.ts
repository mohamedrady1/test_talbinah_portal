import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { catchError, finalize, tap, EMPTY } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared';
import { MoodsListState, initialMoodsListState } from '../models/moods.state';
import { IMentalHealthScalesApiClient, MentalHealthScalesApiClientProvider } from '../clients';
import { IMoodsListingResponseDto } from '../dtos';

// Define a State Key for TransferState for the moods list
const MOODS_LIST_STATE_KEY = makeStateKey<MoodsListState>('moodsListState');

@Injectable({
  providedIn: 'root', // Singleton service
})
export class MoodsListingFacade {
  // --- Dependencies ---
  private _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Signal) ---
  private readonly _moodsState = signal<MoodsListState>(initialMoodsListState);

  // --- Exposed Selectors (Computed Signals) for the Moods Listing ---
  readonly moods = computed(() => this._moodsState().response);
  readonly isLoading = computed(() => this._moodsState().isLoading);
  readonly isFiltering = computed(() => this._moodsState().isFiltering);
  readonly errorMessage = computed(() => this._moodsState().errorMessage);
  // Removed pagination-related computed signals: totalItems, currentPage, totalPages

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(MOODS_LIST_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating moods list state from TransferState:', cachedState);
      //   this.updateMoodsState(cachedState);
      //   this._transferState.remove(MOODS_LIST_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Fetches the list of moods.
   * Manages loading states, error handling, and SSR TransferState.
   * @param filter Indicates if this fetch is a result of a filter operation.
   */
  getMoodsListing(filter: boolean = false): void { // Removed 'page' parameter
    Logger.debug(`Fetching moods list, filter: ${filter}...`);

    this.updateMoodsState({
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null, // Clear previous errors
      // Removed currentPage update
    });

    // Check TransferState first in the browser, otherwise fetch
    // const cachedState = this._transferState.get(MOODS_LIST_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
    //   Logger.debug('Using cached moods list data from TransferState.');
    //   this.updateMoodsState({
    //     ...cachedState,
    //     isLoading: false,
    //     isFiltering: false,
    //   });
    //   this._transferState.remove(MOODS_LIST_STATE_KEY);
    //   return;
    // }

    // Perform actual API call
    // Assuming getMoods() now takes no parameters or an empty object for filters if needed
    this._apiClient.getMoods() // Removed paginationParams
      .pipe(
        tap((response: IMoodsListingResponseDto) => {
          if (response && response) {
            this.updateMoodsState({
              response: response,
              // Removed totalItems update as it's typically tied to pagination meta
              errorMessage: null,
            });
            // Removed totalPages update

            // Store in TransferState for SSR
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(MOODS_LIST_STATE_KEY, this._moodsState());
              Logger.debug('Stored moods list state in TransferState for SSR.');
            }
            Logger.debug('Moods list fetched successfully:', response);
          } else {
            this.updateMoodsState({
              response: null,
              // Removed totalItems: 0
              errorMessage: this._localizationService.translateTextFromJson('moods.emptyState.noMoodsFound'),
            });
            Logger.warn('No moods found or data is empty.');
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error, 'general.errorLoadingMoods');
          return EMPTY; // Prevent stream from completing on error
        }),
        finalize(() => {
          this.finalizeFetch(filter);
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the moods list.
   */
  resetMoodsListState(): void {
    this._moodsState.set(initialMoodsListState);
    // Removed paginationParams reset
    Logger.debug('Moods list state reset.');
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update the moods list state immutably.
   */
  private updateMoodsState(updates: Partial<MoodsListState>): void {
    this._moodsState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during data fetching and updates the state.
   */
  private handleFetchError(error: ApiError, translationKey: string): void {
    Logger.error(`Error fetching moods list:`, error);
    handleApiErrors(error);
    // this._toastService.error(this._localizationService.translateTextFromJson(translationKey));
    this.updateMoodsState({
      errorMessage: this._localizationService.translateTextFromJson(translationKey),
      response: null, // Clear data on error
    });
  }

  /**
   * Finalizes the fetch operation by resetting loading states.
   */
  private finalizeFetch(filter: boolean | undefined): void {
    this.updateMoodsState({
      isLoading: false,
      isFiltering: false,
    });
    Logger.debug('Moods list fetch finalized.');
  }
}
