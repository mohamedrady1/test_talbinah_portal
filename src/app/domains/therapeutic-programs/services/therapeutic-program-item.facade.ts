import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, Logger } from '../../../common';
import { ITherapeuticProgramItemResponseDto } from '../dtos'; // Import the specific DTO
import { catchError, finalize, tap, EMPTY, Observable, BehaviorSubject } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared';
import { ITherapeuticProgramsApiClient, TherapeuticProgramsApiClientProvider } from '../clients'; // Use the same API client
import { initialProgramItemState, ProgramItemState } from '../models';

// Define a State Key for TransferState for the individual program item
const PROGRAM_ITEM_STATE_KEY = makeStateKey<ProgramItemState>('therapeuticProgramItemState');

@Injectable({
  providedIn: 'root', // Singleton service
})
export class TherapeuticProgramItemFacade {
  // --- Dependencies ---
  private _apiClient: ITherapeuticProgramsApiClient = inject(TherapeuticProgramsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Signal) ---
  private readonly _itemState = signal<ProgramItemState>(initialProgramItemState);

  // --- Exposed Selectors (Computed Signals) for the Therapeutic Program Item ---
  readonly programItem = computed(() => this._itemState().item);
  readonly isLoading = computed(() => this._itemState().isLoading);
  readonly errorMessage = computed(() => this._itemState().errorMessage);
  readonly status = computed(() => this._itemState().status);
  openProgramDetails = new BehaviorSubject<{ id: number } | null>(null);

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get(PROGRAM_ITEM_STATE_KEY, null);
      // if (cachedState) {
      //   Logger.debug('Hydrating program item state from TransferState:', cachedState);
      //   this.updateItemState(cachedState);
      //   this._transferState.remove(PROGRAM_ITEM_STATE_KEY);
      // }
    }
  }

  // --- Public Action Methods ---

  /**
   * Fetches a single therapeutic program by its ID.
   * Manages loading states, error handling, and SSR TransferState.
   * @param id The ID of the therapeutic program.
   */
  getTherapeuticProgramById(id: number): void {
    Logger.debug(`Fetching therapeutic program with ID: ${id}...`);

    this.updateItemState({
      isLoading: true,
      errorMessage: null, // Clear previous errors
    });

    // const cachedState = this._transferState.get(PROGRAM_ITEM_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && cachedState.item?.data?.id === id) {
    //   Logger.debug(`Using cached program item data from TransferState for ID: ${id}.`);
    //   this.updateItemState({
    //     ...cachedState,
    //     isLoading: false, // Ensure loading is off
    //   });
    //   this._transferState.remove(PROGRAM_ITEM_STATE_KEY);
    //   return;
    // }

    // Perform actual API call
    this._apiClient.getTherapeuticProgramById(id)
      .pipe(
        tap((response: ITherapeuticProgramItemResponseDto) => {
          if (response && response.data) {
            this.updateItemState({
              item: response,
              errorMessage: null,
              status: true,
            });
            // Store in TransferState for SSR
            if (!isPlatformBrowser(this._platformId)) {
              this._transferState.set(PROGRAM_ITEM_STATE_KEY, this._itemState());
              Logger.debug(`Stored program item state in TransferState for SSR for ID: ${id}.`);
            }
            Logger.debug(`Therapeutic program ID ${id} fetched successfully:`, response);
          } else {
            this.updateItemState({
              item: null,
              errorMessage: response?.message || this._localizationService.translateTextFromJson('program.emptyState.programNotFound'),
              status: false,
            });
            Logger.warn(`Therapeutic program ID ${id} not found or data is empty.`);
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error, 'general.errorLoadingProgramDetails');
          // this.errorMessage.set(error?.message || this._localizationService.translateTextFromJson('program.emptyState.programNotFound'));
          return EMPTY; // Prevent stream from completing on error
        }),
        finalize(() => {
          this.finalizeFetch();
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of the individual program item.
   */
  resetItemState(): void {
    this._itemState.set(initialProgramItemState);
    Logger.debug('Therapeutic program item state reset.');
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update the program item state immutably.
   */
  private updateItemState(updates: Partial<ProgramItemState>): void {
    this._itemState.update(currentState => ({
      ...currentState,
      ...updates,
    }));
  }

  /**
   * Handles errors during data fetching and updates the state.
   */
  private handleFetchError(error: ApiError, translationKey: string): void {
    Logger.error(`Error fetching program item:`, error);
    handleApiErrors(error); // Common API error handling (e.g., logging to external service)

    // Use API error message if available, otherwise fallback to translation key
    const errorMessage = error?.message || this._localizationService.translateTextFromJson(translationKey);

    this.updateItemState({
      errorMessage: errorMessage,
      item: null, // Clear data on error
      status: false,
    });
  }

  /**
   * Finalizes the fetch operation by resetting loading states.
   */
  private finalizeFetch(): void {
    this.updateItemState({
      isLoading: false,
      status: null,
    });
    Logger.debug('Program item fetch finalized.');
  }
}
