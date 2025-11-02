import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, IPaginationParameters, defaultPaginationParameters, Logger } from '../../../common';
import { IMyTherapeuticProgramsResponseDto, ITherapeuticProgramsListingResponseDto } from '../dtos';
import { catchError, finalize, tap, EMPTY, Observable } from 'rxjs';
import { LocalizationService, ToastService } from '../../../shared';
// Ensure these imports are correct based on your file structure
import { TherapeuticProgramsFeatureState, initialProgramListState, initialTherapeuticProgramsFeatureState, ProgramListState } from '../models/therapeutic-programs.state';
import { ITherapeuticProgramsApiClient, TherapeuticProgramsApiClientProvider } from '../clients';

// Define State Keys for TransferState
const ALL_PROGRAMS_STATE_KEY = makeStateKey<ProgramListState>('allTherapeuticProgramsState');
const MY_PROGRAMS_STATE_KEY = makeStateKey<ProgramListState>('myTherapeuticProgramsState');


@Injectable({
  providedIn: 'root', // Singleton service
})
export class TherapeuticProgramsFacade {
  // --- Dependencies ---
  private _apiClient: ITherapeuticProgramsApiClient = inject(TherapeuticProgramsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  // --- Internal Feature State (Signal) ---
  // This signal holds the entire feature state, enabling immutable updates.
  private readonly _featureState = signal<TherapeuticProgramsFeatureState>(initialTherapeuticProgramsFeatureState);

  // --- Exposed Selectors (Computed Signals) for All Therapeutic Programs ---
  readonly allPrograms = computed(() => this._featureState().allPrograms.response);
  readonly isLoadingAllPrograms = computed(() => this._featureState().allPrograms.isLoading);
  readonly isFilteringAllPrograms = computed(() => this._featureState().allPrograms.isFiltering);
  readonly allProgramsErrorMessage = computed(() => this._featureState().allPrograms.errorMessage);
  readonly allProgramsStatus = computed(() => this._featureState().allPrograms.status); // ADDED: All Programs Status
  readonly totalAllProgramsItems = computed(() => this._featureState().allPrograms.totalItems);
  readonly currentAllProgramsPage = computed(() => this._featureState().allPrograms.currentPage);
  readonly totalAllProgramsPages = computed(() => this._featureState().allPrograms.totalPages);

  // --- Exposed Selectors (Computed Signals) for My Therapeutic Programs ---
  readonly myPrograms = computed(() => this._featureState().myPrograms.response);
  readonly isLoadingMyPrograms = computed(() => this._featureState().myPrograms.isLoading);
  readonly isFilteringMyPrograms = computed(() => this._featureState().myPrograms.isFiltering);
  readonly myProgramsErrorMessage = computed(() => this._featureState().myPrograms.errorMessage);
  readonly myProgramsStatus = computed(() => this._featureState().myPrograms.status); // ADDED: My Programs Status
  readonly totalMyProgramsItems = computed(() => this._featureState().myPrograms.totalItems);
  readonly currentMyProgramsPage = computed(() => this._featureState().myPrograms.currentPage);
  readonly totalMyProgramsPages = computed(() => this._featureState().myPrograms.totalPages);


  // --- Internal Pagination Parameters ---
  private _allProgramsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters };
  private _myProgramsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters };


  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      const allProgramsState = this._transferState.get(ALL_PROGRAMS_STATE_KEY, null);
      if (allProgramsState) {
        Logger.debug('Hydrating allPrograms state from TransferState:', allProgramsState);
        this.updateProgramListState('allPrograms', allProgramsState);
        // Remove from TransferState to prevent re-use
        this._transferState.remove(ALL_PROGRAMS_STATE_KEY);
      }

      const myProgramsState = this._transferState.get(MY_PROGRAMS_STATE_KEY, null);
      if (myProgramsState) {
        Logger.debug('Hydrating myPrograms state from TransferState:', myProgramsState);
        this.updateProgramListState('myPrograms', myProgramsState);
        this._transferState.remove(MY_PROGRAMS_STATE_KEY);
      }
    }
  }

  // --- Public Action Methods ---
  fetchAllTherapeuticPrograms(page: number = this._allProgramsPaginationParams.page || 1, filter: boolean = false): void {
    Logger.debug(`Fetching ALL programs for page ${page}, filter: ${filter}...`);

    this._allProgramsPaginationParams.page = page;
    this._allProgramsPaginationParams.total = this._allProgramsPaginationParams.per_page; // Added this line

    // Update loading state
    this.updateProgramListState('allPrograms', {
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null, // Clear previous errors
      status: null, // Clear previous status
      currentPage: page,
    });

    // Check TransferState first in the browser, otherwise fetch
    // const cachedState = this._transferState.get(ALL_PROGRAMS_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
    //   Logger.debug('Using cached allPrograms data from TransferState.');
    //   this.updateProgramListState('allPrograms', {
    //     ...cachedState,
    //     isLoading: false,
    //     isFiltering: false,
    //   });
    //   this._transferState.remove(ALL_PROGRAMS_STATE_KEY);
    //   return;
    // }

    // Perform actual API call
    this._apiClient.getAll(this._allProgramsPaginationParams)
      .pipe(
        tap((response: ITherapeuticProgramsListingResponseDto) => {
          this.processProgramResponse(response, 'allPrograms');
          // Store in TransferState for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_PROGRAMS_STATE_KEY, this._featureState().allPrograms);
            Logger.debug('Stored allPrograms state in TransferState for SSR.');
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error, 'allPrograms', 'general.errorLoadingPodcasts');
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeFetch('allPrograms', filter);
        })
      )
      .subscribe();
  }

  /**
   * Fetches the list of therapeutic programs for the current user.
   * @param page The page number to fetch.
   * @param filter Indicates if this fetch is a result of a filter operation.
   */
  fetchMyTherapeuticPrograms(page: number = this._myProgramsPaginationParams.page || 1, filter: boolean = false): void {
    Logger.debug(`Fetching MY programs for page ${page}, filter: ${filter}...`);

    this._myProgramsPaginationParams.page = page;

    this.updateProgramListState('myPrograms', {
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null,
      status: null, // Clear previous status
      currentPage: page,
    });

    // const cachedState = this._transferState.get(MY_PROGRAMS_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
    //   Logger.debug('Using cached myPrograms data from TransferState.');
    //   this.updateProgramListState('myPrograms', {
    //     ...cachedState,
    //     isLoading: false,
    //     isFiltering: false,
    //   });
    //   this._transferState.remove(MY_PROGRAMS_STATE_KEY);
    //   return;
    // }

    // Assuming a separate API client method for user-specific programs
    // Replace `_apiClient.getMyPrograms` with your actual method.
    this._apiClient.getMyPrograms(this._myProgramsPaginationParams) // **IMPORTANT: Replace with your actual method**
      .pipe(
        tap((response: IMyTherapeuticProgramsResponseDto) => {
          // Assuming IMyTherapeuticProgramsResponseDto has a `status` field or you derive it
          this.processProgramResponse(response as any, 'myPrograms'); // Cast if DTOs differ slightly but are compatible for processProgramResponse
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(MY_PROGRAMS_STATE_KEY, this._featureState().myPrograms);
            Logger.debug('Stored myPrograms state in TransferState for SSR.');
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error, 'myPrograms', 'general.errorLoadingMyPodcasts'); // Use a different translation key for "my" programs error
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeFetch('myPrograms', filter);
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of a specific program list or all program lists.
   * @param listType 'allPrograms' or 'myPrograms' or undefined to reset all.
   */
  resetProgramListState(listType?: 'allPrograms' | 'myPrograms'): void {
    if (listType === 'allPrograms') {
      this._featureState.update(state => ({
        ...state,
        allPrograms: { ...initialProgramListState },
      }));
      this._allProgramsPaginationParams = { ...defaultPaginationParameters };
      Logger.debug('All programs list state reset.');
    } else if (listType === 'myPrograms') {
      this._featureState.update(state => ({
        ...state,
        myPrograms: { ...initialProgramListState },
      }));
      this._myProgramsPaginationParams = { ...defaultPaginationParameters };
      Logger.debug('My programs list state reset.');
    } else {
      this._featureState.set(initialTherapeuticProgramsFeatureState);
      this._allProgramsPaginationParams = { ...defaultPaginationParameters };
      this._myProgramsPaginationParams = { ...defaultPaginationParameters };
      Logger.debug('All therapeutic programs feature states reset.');
    }
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update a specific program list state immutably.
   */
  private updateProgramListState(
    listKey: keyof TherapeuticProgramsFeatureState,
    updates: Partial<ProgramListState>
  ): void {
    this._featureState.update(currentFeatureState => ({
      ...currentFeatureState,
      [listKey]: {
        ...currentFeatureState[listKey],
        ...updates,
      },
    }));
  }

  /**
   * Processes the API response for a program list and updates the state.
   */
  private processProgramResponse(response: ITherapeuticProgramsListingResponseDto, listKey: keyof TherapeuticProgramsFeatureState): void {
    const paginationParams = listKey === 'allPrograms' ? this._allProgramsPaginationParams : this._myProgramsPaginationParams;

    if (response && response.data && response.data.length > 0) {
      this.updateProgramListState(listKey, {
        response: response,
        totalItems: response.data.length ?? response.data.length, // Prefer meta.total if available, otherwise data length
        errorMessage: null,
        status: true, // Request successful
      });

      // Calculate total pages based on `meta.last_page` or calculated locally
      // const totalPages = response.meta?.last_page ?? Math.ceil((response.meta?.total ?? response.data.length) / (paginationParams.per_page || 1));
      // this.updateProgramListState(listKey, { totalPages: totalPages });

      Logger.debug(`${listKey} programs fetched successfully:`, response);
    } else {
      this.updateProgramListState(listKey, {
        response: null,
        totalItems: 0,
        errorMessage: 'therapeutic_programs_no_programs_in_category',
        status: true, // Still a successful request, just no data found
      });
      Logger.warn(`No ${listKey} programs found.`);
    }
  }

  /**
   * Handles errors during data fetching and updates the state.
   */
  private handleFetchError(error: ApiError, listKey: keyof TherapeuticProgramsFeatureState, translationKey: string): void {
    Logger.error(`Error fetching ${listKey} programs:`, error);
    handleApiErrors(error); // Common API error handling (e.g., logging to external service)

    // Use API error message if available, otherwise fallback to translation key
    const errorMessage = error?.message || this._localizationService.translateTextFromJson(translationKey);

    this.updateProgramListState(listKey, {
      errorMessage: errorMessage,
      response: null,
      status: false
    });
  }

  /**
   * Finalizes the fetch operation by resetting loading states.
   */
  private finalizeFetch(listKey: keyof TherapeuticProgramsFeatureState, filter: boolean | undefined): void {
    this.updateProgramListState(listKey, {
      isLoading: false,
      isFiltering: false, // Ensure both are reset
    });
    Logger.debug(`${listKey} fetch finalized.`);
  }

  // --- Other Business Logic (example) ---
  protected openProgramSubscription(programId: string): void {
    Logger.debug(`Facade handling subscription for program ID: ${programId}`);
  }
  resetMyPrograms(): void {
    this._featureState.update(state => ({
      ...state,
      myPrograms: { ...initialProgramListState },
    }));
    this._myProgramsPaginationParams = { ...defaultPaginationParameters };
    Logger.debug('My programs list state reset.');
  }
}
