import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiError, handleApiErrors, IPaginationParameters, defaultPaginationParameters, Logger, StorageService } from '../../../common';
import { catchError, finalize, tap, EMPTY, Observable } from 'rxjs';
import { LocalizationService, StorageKeys, ToastService } from '../../../shared';
import { ISupportGroupsApiClient, SupportGroupsApiClientProvider } from '../clients';
import { IMySeminarsResponseDto, ISeminarsListingResponseDto } from '../dtos';
import { SeminarsListState, SeminarsFeatureState, initialSeminarsFeatureState, initialSeminarsListState } from '../models';
import { WalletFacade } from '../../settings';
import { UserContextService } from '../../authentication';


// Define State Keys for TransferState
const ALL_SEMINARS_STATE_KEY = makeStateKey<SeminarsListState>('allSeminarsState');
const MY_SEMINARS_STATE_KEY = makeStateKey<SeminarsListState>('mySeminarsState');


@Injectable({
  providedIn: 'root', // Singleton service
})
export class SeminarsFacade { // Renamed: TherapeuticProgramsFacade -> SeminarsFacade
  private walletService = inject(WalletFacade);
  // --- Dependencies ---
  private _apiClient: ISupportGroupsApiClient = inject(SupportGroupsApiClientProvider).getClient(); // Renamed: ITherapeuticProgramsApiClient -> ISeminarsApiClient, TherapeuticProgramsApiClientProvider -> SeminarsApiClientProvider
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);

  // Cache mechanism
  private _lastFetchAllSeminarsTime: number = 0;
  private _lastFetchMySeminarsTime: number = 0;
  private readonly CACHE_DURATION = 1000; // 1 seconds cache

  // --- Internal Feature State (Signal) ---
  // This signal holds the entire feature state, enabling immutable updates.
  private readonly _featureState = signal<SeminarsFeatureState>(initialSeminarsFeatureState); // Renamed: TherapeuticProgramsFeatureState -> SeminarsFeatureState, initialTherapeuticProgramsFeatureState -> initialSeminarsFeatureState

  // --- Exposed Selectors (Computed Signals) for All Seminars ---
  readonly allSeminars = computed(() => this._featureState().allSeminars.response); // Renamed: allSeminars -> allSeminars
  readonly isLoadingAllSeminars = computed(() => this._featureState().allSeminars.isLoading); // Renamed: isLoadingAllSeminars -> isLoadingAllSeminars
  readonly isFilteringAllSeminars = computed(() => this._featureState().allSeminars.isFiltering); // Renamed: isFilteringAllSeminars -> isFilteringAllSeminars
  readonly allSeminarsErrorMessage = computed(() => this._featureState().allSeminars.errorMessage); // Renamed: allSeminarsErrorMessage -> allSeminarsErrorMessage
  readonly allSeminarsStatus = computed(() => this._featureState().allSeminars.status); // Renamed: allSeminarsStatus -> allSeminarsStatus
  readonly totalAllSeminarsItems = computed(() => this._featureState().allSeminars.totalItems); // Renamed: totalAllSeminarsItems -> totalAllSeminarsItems
  readonly currentAllSeminarsPage = computed(() => this._featureState().allSeminars.currentPage); // Renamed: currentAllSeminarsPage -> currentAllSeminarsPage
  readonly totalAllSeminarsPages = computed(() => this._featureState().allSeminars.totalPages); // Renamed: totalAllSeminarsPages -> totalAllSeminarsPages

  // --- Exposed Selectors (Computed Signals) for My Seminars ---
  readonly mySeminars = computed(() => this._featureState().myPrograms.response); // Renamed: myPrograms -> mySeminars
  readonly isLoadingMySeminars = computed(() => this._featureState().myPrograms.isLoading); // Renamed: isLoadingMyPrograms -> isLoadingMySeminars
  readonly isFilteringMySeminars = computed(() => this._featureState().myPrograms.isFiltering); // Renamed: isFilteringMyPrograms -> isFilteringMySeminars
  readonly mySeminarsErrorMessage = computed(() => this._featureState().myPrograms.errorMessage); // Renamed: myProgramsErrorMessage -> mySeminarsErrorMessage
  readonly mySeminarsStatus = computed(() => this._featureState().myPrograms.status); // Renamed: myProgramsStatus -> mySeminarsStatus
  readonly totalMySeminarsItems = computed(() => this._featureState().myPrograms.totalItems); // Renamed: totalMyProgramsItems -> totalMySeminarsItems
  readonly currentMySeminarsPage = computed(() => this._featureState().myPrograms.currentPage); // Renamed: currentMyProgramsPage -> currentMySeminarsPage
  readonly totalMySeminarsPages = computed(() => this._featureState().myPrograms.totalPages); // Renamed: totalMyProgramsPages -> totalMySeminarsPages


  // --- Internal Pagination Parameters ---
  private _allSeminarsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters }; // Renamed: _allSeminarsPaginationParams -> _allSeminarsPaginationParams
  private _mySeminarsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, total: 6 }; // Renamed: _myProgramsPaginationParams -> _mySeminarsPaginationParams
  // private _allSeminarsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, total: this.totalAllSeminarsItems() }; // Renamed: _allSeminarsPaginationParams -> _allSeminarsPaginationParams
  // private _mySeminarsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters, total: this.totalMySeminarsItems() }; // Renamed: _myProgramsPaginationParams -> _mySeminarsPaginationParams
  private token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );
  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  constructor() {
    // Attempt to retrieve state from TransferState during client-side hydration
    if (isPlatformBrowser(this._platformId)) {
      const allSeminarsState = this._transferState.get(ALL_SEMINARS_STATE_KEY, null); // Renamed: ALL_PROGRAMS_STATE_KEY -> ALL_SEMINARS_STATE_KEY
      if (allSeminarsState) {
        Logger.debug('Hydrating allSeminars state from TransferState:', allSeminarsState); // Renamed: allSeminars -> allSeminars
        this.updateSeminarsListState('allSeminars', allSeminarsState);
        // Remove from TransferState to prevent re-use
        this._transferState.remove(ALL_SEMINARS_STATE_KEY); // Renamed: ALL_PROGRAMS_STATE_KEY -> ALL_SEMINARS_STATE_KEY
      }

      const mySeminarsState = this._transferState.get(MY_SEMINARS_STATE_KEY, null); // Renamed: MY_PROGRAMS_STATE_KEY -> MY_SEMINARS_STATE_KEY
      if (mySeminarsState) {
        Logger.debug('Hydrating mySeminars state from TransferState:', mySeminarsState); // Renamed: myPrograms -> mySeminars
        this.updateSeminarsListState('myPrograms', mySeminarsState);
        this._transferState.remove(MY_SEMINARS_STATE_KEY); // Renamed: MY_PROGRAMS_STATE_KEY -> MY_SEMINARS_STATE_KEY
      }
    }
  }

  // --- Public Action Methods ---
  fetchAllSeminars(
    page: number = this._allSeminarsPaginationParams.page || 1,
    filter: boolean = false,
    fetchWallet: boolean = true // <-- new flag
  ): void {
    Logger.debug(`Fetching ALL seminars for page ${page}, filter: ${filter}...`); // Renamed: programs -> seminars

    // Check cache validity for page 1 only (to avoid caching paginated results)
    if (page === 1 && !filter) {
      const now = Date.now();
      if (this.allSeminars() && (now - this._lastFetchAllSeminarsTime) < this.CACHE_DURATION) {
        Logger.debug('SeminarsFacade: Using cached all seminars data');
        return;
      }
    }

    this._allSeminarsPaginationParams.page = page; // Renamed: _allSeminarsPaginationParams -> _allSeminarsPaginationParams

    // Update loading state
    this.updateSeminarsListState('allSeminars', {
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null, // Clear previous errors
      status: null, // Clear previous status
      currentPage: page,
    });

    // Check TransferState first in the browser, otherwise fetch
    // const cachedState = this._transferState.get(ALL_SEMINARS_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
    //   Logger.debug('Using cached allSeminars data from TransferState.');
    //   this.updateSeminarsListState('allSeminars', {
    //     ...cachedState,
    //     isLoading: false,
    //     isFiltering: false,
    //   });
    //   this._transferState.remove(ALL_SEMINARS_STATE_KEY);
    //   return;
    // }

    // Perform actual API call
    this._apiClient.getAll(this._allSeminarsPaginationParams) // Updated to `getAll` from the new API
      .pipe(
        tap((response: ISeminarsListingResponseDto) => { // Renamed: ITherapeuticProgramsListingResponseDto -> ISeminarsListingResponseDto
          this.processAllSeminarsResponse(response, 'allSeminars');
          // Store in TransferState for SSR
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_SEMINARS_STATE_KEY, this._featureState().allSeminars); // Renamed: ALL_PROGRAMS_STATE_KEY -> ALL_SEMINARS_STATE_KEY
            Logger.debug('Stored allSeminars state in TransferState for SSR.'); // Renamed: allSeminars -> allSeminars
          }
          // Only fetch wallet if explicitly requested and user is logged in
          if (fetchWallet && this._UserContextService.isLoggedIn()) {
            Logger.debug('🔄 SeminarsFacade: Fetching wallet after seminars fetch');
            this.walletService.fetchWallet();
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error.message, 'allSeminars', 'general.errorLoadingSeminars'); // Renamed: errorLoadingPodcasts -> errorLoadingSeminars
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeFetch('allSeminars', filter);
        })
      )
      .subscribe();
  }

  /**
   * Fetches the list of seminars for the current user.
   * @param page The page number to fetch.
   * @param filter Indicates if this fetch is a result of a filter operation.
   */
  fetchMySeminars(page: number = this._mySeminarsPaginationParams.page || 1, filter: boolean = false): void { // Renamed: fetchMyTherapeuticPrograms -> fetchMySeminars, _myProgramsPaginationParams -> _mySeminarsPaginationParams
    Logger.debug(`Fetching MY seminars for page ${page}, filter: ${filter}...`); // Renamed: programs -> seminars

    // Check cache validity for page 1 only (to avoid caching paginated results)
    if (page === 1 && !filter) {
      const now = Date.now();
      if (this.mySeminars() && (now - this._lastFetchMySeminarsTime) < this.CACHE_DURATION) {
        Logger.debug('SeminarsFacade: Using cached my seminars data');
        return;
      }
    }

    this._mySeminarsPaginationParams.page = page; // Renamed: _myProgramsPaginationParams -> _mySeminarsPaginationParams

    this.updateSeminarsListState('myPrograms', {
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null,
      status: null, // Clear previous status
      currentPage: page,
    });

    // const cachedState = this._transferState.get(MY_SEMINARS_STATE_KEY, null);
    // if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
    //   Logger.debug('Using cached mySeminars data from TransferState.');
    //   this.updateSeminarsListState('myPrograms', {
    //     ...cachedState,
    //     isLoading: false,
    //     isFiltering: false,
    //   });
    //   this._transferState.remove(MY_SEMINARS_STATE_KEY);
    //   return;
    // }

    // Updated to `MySeminarsListing` from the new API
    this._apiClient.MySeminarsListing(this._mySeminarsPaginationParams)
      .pipe(
        tap((response: IMySeminarsResponseDto) => { // Renamed: IMyTherapeuticProgramsResponseDto -> IMySeminarsResponseDto
          this.processAllSeminarsResponse(response as any, 'myPrograms'); // Cast if DTOs differ slightly but are compatible for processAllSeminarsResponse
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(MY_SEMINARS_STATE_KEY, this._featureState().myPrograms); // Renamed: MY_PROGRAMS_STATE_KEY -> MY_SEMINARS_STATE_KEY
            Logger.debug('Stored mySeminars state in TransferState for SSR.'); // Renamed: myPrograms -> mySeminars
          }
          if (this.token())
            this.walletService.fetchWallet();
        }),
        catchError((error: ApiError) => {

          this.handleFetchError(error.message, 'myPrograms', 'general.errorLoadingMySeminars'); // Renamed: errorLoadingMyPodcasts -> errorLoadingMySeminars
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeFetch('myPrograms', filter);
        })
      )
      .subscribe();
  }

  /**
   * Resets the state of a specific seminar list or all seminar lists.
   * @param listType 'allSeminars' or 'myPrograms' or undefined to reset all.
   */
  resetSeminarsListState(listType?: 'allSeminars' | 'myPrograms'): void { // Consider renaming this method to `resetSeminarListState` for consistency
    if (listType === 'allSeminars') {
      this._featureState.update(state => ({
        ...state,
        allSeminars: { ...initialSeminarsListState },
      }));
      this._allSeminarsPaginationParams = { ...defaultPaginationParameters }; // Renamed: _allSeminarsPaginationParams -> _allSeminarsPaginationParams
      this._lastFetchAllSeminarsTime = 0; // Reset cache timestamp
      Logger.debug('All seminars list state reset.'); // Renamed: programs -> seminars
    } else if (listType === 'myPrograms') {
      this._featureState.update(state => ({
        ...state,
        myPrograms: { ...initialSeminarsListState },
      }));
      this._mySeminarsPaginationParams = { ...defaultPaginationParameters }; // Renamed: _myProgramsPaginationParams -> _mySeminarsPaginationParams
      this._lastFetchMySeminarsTime = 0; // Reset cache timestamp
      Logger.debug('My seminars list state reset.'); // Renamed: programs -> seminars
    } else {
      this._featureState.set(initialSeminarsFeatureState); // Renamed: initialTherapeuticProgramsFeatureState -> initialSeminarsFeatureState
      this._allSeminarsPaginationParams = { ...defaultPaginationParameters }; // Renamed: _allSeminarsPaginationParams -> _allSeminarsPaginationParams
      this._mySeminarsPaginationParams = { ...defaultPaginationParameters }; // Renamed: _myProgramsPaginationParams -> _mySeminarsPaginationParams
      this._lastFetchAllSeminarsTime = 0; // Reset cache timestamp
      this._lastFetchMySeminarsTime = 0; // Reset cache timestamp
      Logger.debug('All seminars feature states reset.'); // Renamed: therapeutic programs -> seminars
    }
  }

  // --- Private Utility Methods for State Management ---

  /**
   * Utility to update a specific program list state immutably.
   */
  private updateSeminarsListState( // Consider renaming to `updateSeminarListState`
    listKey: keyof SeminarsFeatureState, // Renamed: TherapeuticProgramsFeatureState -> SeminarsFeatureState
    updates: Partial<SeminarsListState>
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
   * Processes the API response for a seminar list and updates the state.
   */
  private processAllSeminarsResponse(response: ISeminarsListingResponseDto | IMySeminarsResponseDto, listKey: keyof SeminarsFeatureState): void { // Adjusted response type for flexibility
    const paginationParams = listKey === 'allSeminars' ? this._allSeminarsPaginationParams : this._mySeminarsPaginationParams; // Renamed pagination params

    // Check if response.data.data exists for common handling or adjust based on actual DTO structure
    const dataArray = (response as ISeminarsListingResponseDto).data || (response as IMySeminarsResponseDto).data;

    if (response && dataArray && dataArray.length > 0) {
      this.updateSeminarsListState(listKey, {
        response: response as ISeminarsListingResponseDto | IMySeminarsResponseDto | null, // Cast back to original DTO type for storage
        // totalItems: (response as ISeminarsListingResponseDto | IMySeminarsResponseDto | null)?.data?.meta?.total ?? dataArray.length, // Prefer meta.total if available, otherwise data length
        totalItems: (response as ISeminarsListingResponseDto | IMySeminarsResponseDto | null)?.data?.length ?? dataArray.length, // Prefer meta.total if available, otherwise data length
        errorMessage: null,
        status: true, // Request successful
      });

      // Calculate total pages based on `meta.last_page` or calculated locally
      // const totalPages = (response as ISeminarsListingResponseDto | IMySeminarsResponseDto | null)?.data?.meta?.last_page ?? Math.ceil(((response as any).data?.meta?.total ?? dataArray.length) / (paginationParams.per_page || 1));
      const totalPages = (response as ISeminarsListingResponseDto | IMySeminarsResponseDto | null)?.data?.length ?? Math.ceil(((response as any).data?.meta?.total ?? dataArray.length) / (paginationParams.per_page || 1));
      this.updateSeminarsListState(listKey, { totalPages: totalPages });


      // Update cache timestamp
      if (listKey === 'allSeminars') {
        this._lastFetchAllSeminarsTime = Date.now();
      } else if (listKey === 'myPrograms') {
        this._lastFetchMySeminarsTime = Date.now();
      }

      Logger.debug(`${listKey} seminars fetched successfully:`, response); // Renamed: programs -> seminars
    } else {
      this.updateSeminarsListState(listKey, {
        response: null,
        totalItems: 0,
        errorMessage: this._localizationService.translateTextFromJson('seminar.emptyState.noSeminarsInCategory'), // Renamed: podcast -> seminar
        status: true, // Still a successful request, just no data found
      });
      Logger.warn(`No ${listKey} seminars found.`); // Renamed: programs -> seminars
    }
  }

  /**
   * Handles errors during data fetching and updates the state.
   */
  private handleFetchError(error: ApiError | string, listKey: keyof SeminarsFeatureState, translationKey: string): void { // Renamed: TherapeuticProgramsFeatureState -> SeminarsFeatureState
    Logger.error(`Error fetching ${listKey} seminars:`, error); // Renamed: programs -> seminars
    handleApiErrors(error as ApiError); // Common API error handling (e.g., logging to external service)

    // Use API error message if available, otherwise fallback to translation key
    const apiErrorMessage = (error as ApiError)?.message || error as string;
    const errorMessage = apiErrorMessage || this._localizationService.translateTextFromJson(translationKey);

    this._toastService.add({
      severity: 'error',
      summary: errorMessage,
      detail: errorMessage,
      life: 5000
    });
    this.updateSeminarsListState(listKey, {
      errorMessage: errorMessage,
      response: null,
      status: false
    });
  }

  /**
   * Finalizes the fetch operation by resetting loading states.
   */
  private finalizeFetch(listKey: keyof SeminarsFeatureState, filter: boolean | undefined): void { // Renamed: TherapeuticProgramsFeatureState -> SeminarsFeatureState
    this.updateSeminarsListState(listKey, {
      isLoading: false,
      isFiltering: false, // Ensure both are reset
    });
    Logger.debug(`${listKey} fetch finalized.`);
  }

  // --- Other Business Logic (example) ---
  protected openSeminarSubscription(seminarId: string): void { // Renamed: openProgramSubscription -> openSeminarSubscription, programId -> seminarId
    Logger.debug(`Facade handling subscription for seminar ID: ${seminarId}`); // Renamed: program -> seminar
  }
}
