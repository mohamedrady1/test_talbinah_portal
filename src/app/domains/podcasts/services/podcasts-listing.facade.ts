import { ApiError, handleApiErrors, IPaginationParameters, defaultPaginationParameters, Logger, IGlobalPodcastItemModel } from '../../../common';
import { inject, Injectable, signal, computed, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { IPodcastsApiClient, PodcastsApiClientProvider, IPodcastsListingResponseDto } from '..';
import { LocalizationService, ToastService } from '../../../shared';
import { catchError, finalize, tap, EMPTY, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const ALL_PODCASTS_STATE_KEY = makeStateKey<PodcastsListState>('allPodcastsState');

@Injectable({ providedIn: 'root' })
export class PodcastsListFacade {
  _openPodcastAudioPlayer$ = new BehaviorSubject<OpenPodcastAudioPlayerState | null>(null);

  private readonly _apiClient: IPodcastsApiClient = inject(PodcastsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _transferState = inject(TransferState);

  private readonly _featureState = signal<PodcastsFeatureState>(initialPodcastsFeatureState);

  readonly allPodcasts = computed(() => this._featureState().allPodcasts.response);
  readonly isLoadingAllPodcasts = computed(() => this._featureState().allPodcasts.isLoading);
  readonly isFilteringAllPodcasts = computed(() => this._featureState().allPodcasts.isFiltering);
  readonly allPodcastsErrorMessage = computed(() => this._featureState().allPodcasts.errorMessage);
  readonly allPodcastsStatus = computed(() => this._featureState().allPodcasts.status);
  readonly totalAllPodcastsItems = computed(() => this._featureState().allPodcasts.totalItems);
  readonly currentAllPodcastsPage = computed(() => this._featureState().allPodcasts.currentPage);
  readonly totalAllPodcastsPages = computed(() => this._featureState().allPodcasts.totalPages);

  private _allPodcastsPaginationParams: IPaginationParameters = { ...defaultPaginationParameters };

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const allPodcastsState = this._transferState.get(ALL_PODCASTS_STATE_KEY, null);
      if (allPodcastsState) {
        this.updatePodcastsListState('allPodcasts', allPodcastsState);
        this._transferState.remove(ALL_PODCASTS_STATE_KEY);
      }
    }
  }

  fetchAllPodcasts(page: number = this._allPodcastsPaginationParams.page || 1, filter: boolean = false): void {
    this._allPodcastsPaginationParams.page = page;

    this.updatePodcastsListState('allPodcasts', {
      isLoading: !filter,
      isFiltering: filter,
      errorMessage: null,
      status: null,
      currentPage: page,
    });

    const cachedState = this._transferState.get(ALL_PODCASTS_STATE_KEY, null);
    if (isPlatformBrowser(this._platformId) && cachedState && !filter) {
      this.updatePodcastsListState('allPodcasts', {
        ...cachedState,
        isLoading: false,
        isFiltering: false,
      });
      this._transferState.remove(ALL_PODCASTS_STATE_KEY);
      return;
    }

    this._apiClient.getAll(this._allPodcastsPaginationParams)
      .pipe(
        tap((response: IPodcastsListingResponseDto) => {
          this.processAllPodcastsResponse(response);
          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_PODCASTS_STATE_KEY, this._featureState().allPodcasts);
          }
        }),
        catchError((error: ApiError) => {
          this.handleFetchError(error, 'allPodcasts', 'general.errorLoadingPodcasts');
          return EMPTY;
        }),
        finalize(() => {
          this.finalizeFetch('allPodcasts', filter);
        })
      )
      .subscribe();
  }

  resetPodcastsListState(): void {
    this._featureState.set(initialPodcastsFeatureState);
    this._allPodcastsPaginationParams = { ...defaultPaginationParameters };
  }

  private updatePodcastsListState(
    listKey: keyof PodcastsFeatureState,
    updates: Partial<PodcastsListState>
  ): void {
    this._featureState.update(currentFeatureState => ({
      ...currentFeatureState,
      [listKey]: {
        ...currentFeatureState[listKey],
        ...updates,
      },
    }));
  }

  private processAllPodcastsResponse(response: IPodcastsListingResponseDto): void {
    const dataArray = response.data;

    if (response && dataArray && (dataArray.podcasts?.length || 0) > 0) {
      this.updatePodcastsListState('allPodcasts', {
        response: response,
        totalItems: (dataArray.podcasts?.length || 0),
        errorMessage: null,
        status: true,
        totalPages: Math.ceil((dataArray.podcasts?.length || 0) / (this._allPodcastsPaginationParams.per_page || 1))
      });
    } else {
      this.updatePodcastsListState('allPodcasts', {
        response: null,
        totalItems: 0,
        errorMessage: 'podcast_no_podcasts_in_category',
        status: true,
      });
    }
  }

  private handleFetchError(error: ApiError, listKey: keyof PodcastsFeatureState, translationKey: string): void {
    Logger.error(`Error fetching ${listKey}:`, error);
    handleApiErrors(error);

    // Use API error message if available, otherwise fallback to translation key
    const errorMessage = error?.message || this._localizationService.translateTextFromJson(translationKey);

    this._toastService.add({
      severity: 'error',
      summary: this._localizationService.translateTextFromJson('general.error'),
      detail: errorMessage,
      life: 5000
    });
    this.updatePodcastsListState(listKey, {
      errorMessage: errorMessage,
      response: null,
      status: false
    });
  }

  private finalizeFetch(listKey: keyof PodcastsFeatureState, filter: boolean | undefined): void {
    this.updatePodcastsListState(listKey, {
      isLoading: false,
      isFiltering: false,
    });
  }
}

// --- State Interfaces ---
export interface PodcastsFeatureState {
  allPodcasts: PodcastsListState;
}

export interface PodcastsListState {
  response: IPodcastsListingResponseDto | null;
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  status: boolean | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// --- Initial States ---
export const initialPodcastsListState: PodcastsListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  status: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
};

export const initialPodcastsFeatureState: PodcastsFeatureState = {
  allPodcasts: initialPodcastsListState,
};


export interface OpenPodcastAudioPlayerState {
  isOpen: boolean;
  item: IGlobalPodcastItemModel | null;
  currentTime?: number;
}
