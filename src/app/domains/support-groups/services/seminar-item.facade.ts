import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { catchError, finalize, tap, EMPTY, BehaviorSubject } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared';
import { ISupportGroupsApiClient, SupportGroupsApiClientProvider } from '../clients';
import { initialSeminarItemState, SeminarItemState } from '../models';
import { ISeminarItemDto, ISeminarItemResponseDto } from '../dtos';

// Define a State Key for TransferState for the individual seminar item
const SEMINAR_ITEM_STATE_KEY = makeStateKey<SeminarItemState>('SeminarItemState');

@Injectable({
  providedIn: 'root', // Singleton service
})
export class SeminarItemFacade {
  // --- Dependencies ---
  private _apiClient: ISupportGroupsApiClient = inject(SupportGroupsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Signal) ---
  private readonly _itemState = signal<SeminarItemState>(initialSeminarItemState);

  // --- Exposed Selectors (Computed Signals) for the Seminar Item ---
  readonly seminarItem = computed(() => this._itemState().item);
  readonly isLoading = computed(() => this._itemState().isLoading);
  readonly errorMessage = computed(() => this._itemState().errorMessage);

  openSeminarDetails = new BehaviorSubject<{ id: number } | null>(null);
  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(SEMINAR_ITEM_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating seminar item state from TransferState:', cachedState);
      //   this.updateItemState(cachedState);
      //   this._transferState.remove(SEMINAR_ITEM_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Fetches a single Seminar by its ID.
   * Manages loading states, error handling, and SSR TransferState.
   * @param id The ID of the Seminar.
   */
  getSeminarById(id: number): void {
    Logger.debug(`Fetching Seminar with ID: ${id}...`);

    this.updateItemState({
      isLoading: true,
      errorMessage: null, // Clear previous errors
    });

    // Perform actual API call
    this._apiClient.getSeminarById(id)
      .pipe(
        tap((response: ISeminarItemResponseDto) => {
          if (response && response.data) {
            this.updateItemState({
              item: response,
              errorMessage: null,
            });
            // Store in TransferState for SSR
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(SEMINAR_ITEM_STATE_KEY, this._itemState());
              Logger.debug(`Stored Seminar item state in TransferState for SSR for ID: ${id}.`);
            }
            Logger.debug(`Seminar ID ${id} fetched successfully:`, response);
          } else {
            // Use the message from the API response if it exists, otherwise use the translated fallback.
            const apiErrorMessage = response?.message;
            this.updateItemState({
              item: null,
              errorMessage: apiErrorMessage || this._localizationService.translateTextFromJson('program.emptyState.programNotFound'),
            });
            Logger.warn(`Seminar ID ${id} not found or data is empty.`);
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error fetching seminar:', error);
          this.handleFetchError(error, 'general.errorLoadingProgramDetails');
          return EMPTY; // Prevent stream from completing on error
        }),
        finalize(() => {
          this.finalizeFetch();
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the individual Seminar item.
   */
  resetItemState(): void {
    this._itemState.set(initialSeminarItemState);
    Logger.debug('Seminar item state reset.');
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update the Seminar item state immutably.
   */
  private updateItemState(updates: Partial<SeminarItemState>): void {
    this._itemState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during data fetching and updates the state.
   */
  private handleFetchError(error: ApiError, translationKey: string): void {
    Logger.error(`Error fetching Seminar item:`, error);
    handleApiErrors(error); // Common API error handling (e.g., logging to external service)

    // Use the message from the API error object first, then the translated key.
    const errorMessage = error?.message || this._localizationService.translateTextFromJson(translationKey);

    this.updateItemState({
      errorMessage: errorMessage,
      item: null, // Clear data on error
    });
  }

  /**
   * Finalizes the fetch operation by resetting loading states.
   */
  private finalizeFetch(): void {
    this.updateItemState({
      isLoading: false,
    });
    Logger.debug('Seminar item fetch finalized.');
  }
}