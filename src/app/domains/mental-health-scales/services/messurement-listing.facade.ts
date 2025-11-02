import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  IPaginationParameters,
  defaultPaginationParameters,
  Logger,
  ApiError,
  handleApiErrors
} from '../../../common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { ToastService, LocalizationService } from '../../../shared';
import {
  IMentalHealthScalesListingResponseDto
} from '../dtos';
import { MentalHealthScalesApiClientProvider, IMentalHealthScalesApiClient } from '../clients';
import { initialMentalHealthScalesFeatureState, MentalHealthScalesFeatureState, MentalHealthScalesListState } from '../models';

const ALL_SCALES_STATE_KEY = makeStateKey<MentalHealthScalesFeatureState>('allMentalHealthScales');

@Injectable({
  providedIn: 'root'
})
export class MentalHealthScalesFacade {
  // --- Dependencies ---
  private readonly _apiClient: IMentalHealthScalesApiClient = inject(MentalHealthScalesApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _featureState = signal<MentalHealthScalesFeatureState>(initialMentalHealthScalesFeatureState);

  // --- Pagination ---
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters };

  // --- Selectors (Computed) ---
  readonly scales = computed(() => this._featureState().scales.response);
  readonly isLoading = computed(() => this._featureState().scales.isLoading);
  readonly isFiltering = computed(() => this._featureState().scales.isFiltering);
  readonly errorMessage = computed(() => this._featureState().scales.errorMessage);
  readonly totalItems = computed(() => this._featureState().scales.totalItems);
  readonly currentPage = computed(() => this._featureState().scales.currentPage);
  readonly totalPages = computed(() => this._featureState().scales.totalPages);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // Correctly type the cachedState when retrieving from TransferState
      // const cachedState = this._transferState.get<MentalHealthScalesFeatureState>(ALL_SCALES_STATE_KEY, initialMentalHealthScalesFeatureState);
      // if (cachedState) {
      //   Logger.debug('Hydrating mental health scales from TransferState', cachedState);
      //   this._updateScalesState(cachedState.scales);
      //   this._transferState.remove(ALL_SCALES_STATE_KEY);
      // }
    }
  }

  fetchAll(page = this._paginationParams.page || 1, filter = false): void {
    Logger.debug(`Fetching mental health scales - Page: ${page}, Filter: ${filter}`);

    this._paginationParams.page = page;

    this._updateScalesState({
      isLoading: !filter,
      isFiltering: filter,
      currentPage: page,
      errorMessage: null
    });

    // Correctly type the cached variable when retrieving from TransferState
    // const cached = this._transferState.get<MentalHealthScalesFeatureState>(ALL_SCALES_STATE_KEY, null as any);
    // if (isPlatformBrowser(this._platformId) && cached && !filter) {
    //   Logger.debug('Using cached scales from TransferState');
    //   this._updateScalesState({
    //     response: cached.scales.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     currentPage: cached.scales.currentPage,
    //     totalItems: cached.scales.totalItems,
    //     totalPages: cached.scales.totalPages
    //   });
    //   this._transferState.remove(ALL_SCALES_STATE_KEY);
    //   return;
    // }

    this._apiClient
      .getAll(this._paginationParams)
      .pipe(
        tap((response: IMentalHealthScalesListingResponseDto) => {
          this._updateScalesState({
            response: response.data, // This is already correct and will now match the state type
            currentPage: page,
            // Assuming your API response provides totalItems and totalPages,
            // you'd also update them here if available in IMentalHealthScalesListingResponseDto
            // totalItems: response.totalItems,
            // totalPages: response.totalPages
          });

          if (!isPlatformBrowser(this._platformId)) {
            // Ensure you store the full state object for SSR
            this._transferState.set(ALL_SCALES_STATE_KEY, this._featureState());
            Logger.debug('Stored mental health scales in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          this._updateScalesState({
            errorMessage: this._localizationService.translateTextFromJson('general.errorLoadingScales'),
            response: [] // Clear response on error to maintain type consistency
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateScalesState({
            isLoading: false,
            isFiltering: false
          });
        })
      )
      .subscribe();
  }

  resetState(): void {
    this._featureState.set(initialMentalHealthScalesFeatureState);
    this._paginationParams = { ...defaultPaginationParameters };
    Logger.debug('Mental health scales state has been reset');
  }

  private _updateScalesState(updates: Partial<MentalHealthScalesListState>): void {
    this._featureState.update(state => ({
      ...state,
      scales: {
        ...state.scales,
        ...updates
      }
    }));
  }
}
