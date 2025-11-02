import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IFavoritePodcastsListingResponseDto, IPodcastCategoriesListingResponseDto, IPodcastsListingResponseDto, IRandomPodcastsListingResponseDto, IRecommendedPodcastsListingResponseDto, ITogglePodcastFavoriteResponseDto } from '../dtos';
import { IPodcastsApiClient, PodcastsApiClientProvider } from '../clients';
import { ApiError, handleApiErrors, IPaginationParameters, Logger, defaultPaginationParameters } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { UserContextService } from '../../authentication';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IPodcast } from '../models';

// Strong types for component configuration
interface AllPodcastsListState {
  allPodcastsResponse: IPodcastsListingResponseDto | null;
  isLoading: boolean;
  isLoadingFilter: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
  totalItems: number;
}

interface FavouritePodcastsListState {
  favouritePodcastsResponse: IFavoritePodcastsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
  totalItems: number;
}

interface RandomPodcastsListState {
  randomPodcastsResponse: IRandomPodcastsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
  totalItems: number;
}

interface RecommendedPodcastsListState {
  recommendedPodcastsResponse: IRandomPodcastsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
  totalItems: number;
}

interface PodcastCategoriesListState {
  categoriesResponse: IPodcastCategoriesListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
}

@Injectable({ providedIn: 'root' })
export class PodcastsMainPageFacade {
  private readonly _PodcastsApiClientProvider: IPodcastsApiClient = inject(PodcastsApiClientProvider).getClient();
  private readonly _ToastService = inject(ToastService);
  private readonly _LocalizationService = inject(LocalizationService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly loadingFavouritesIds = signal<Set<string>>(new Set());

  // States
  private stateAllPodcasts = signal<AllPodcastsListState>({
    allPodcastsResponse: null,
    isLoading: false,
    isLoadingFilter: false,
    errorMessage: null,
    statusRequest: false,
    totalItems: 0
  });

  private stateFavouritePodcasts = signal<FavouritePodcastsListState>({
    favouritePodcastsResponse: null,
    isLoading: false,
    errorMessage: null,
    statusRequest: false,
    totalItems: 0
  });

  private stateRandomPodcasts = signal<RandomPodcastsListState>({
    randomPodcastsResponse: null,
    isLoading: false,
    errorMessage: null,
    statusRequest: false,
    totalItems: 0
  });

  private stateRecommendedPodcasts = signal<RecommendedPodcastsListState>({
    recommendedPodcastsResponse: null,
    isLoading: false,
    errorMessage: null,
    statusRequest: false,
    totalItems: 0
  });

  private statePodcastCategories = signal<PodcastCategoriesListState>({
    categoriesResponse: null,
    isLoading: false,
    errorMessage: null,
    statusRequest: false,
  });

  // Computed values
  readonly allPodcastsResponse = computed(() => this.stateAllPodcasts().allPodcastsResponse);
  readonly isLoadingAllPodcasts = computed(() => this.stateAllPodcasts().isLoading);
  readonly isLoadingAllPodcastsFilter = computed(() => this.stateAllPodcasts().isLoadingFilter);
  readonly errorMessage = computed(() => this.stateAllPodcasts().errorMessage);
  readonly statusRequestAllPodcasts = computed(() => this.stateAllPodcasts().statusRequest);
  readonly totalItems = computed(() => this.stateAllPodcasts().totalItems);

  readonly favouritePodcastsResponse = computed(() => this.stateFavouritePodcasts().favouritePodcastsResponse);
  readonly isLoadingFavouritePodcasts = computed(() => this.stateFavouritePodcasts().isLoading);
  readonly errorMessageFavouritePodcasts = computed(() => this.stateFavouritePodcasts().errorMessage);
  readonly statusRequestFavouritePodcasts = computed(() => this.stateFavouritePodcasts().statusRequest);
  readonly totalFavoriteItems = computed(() => this.stateFavouritePodcasts().totalItems);

  readonly randomPodcastsResponse = computed(() => this.stateRandomPodcasts().randomPodcastsResponse);
  readonly isLoadingRandomPodcasts = computed(() => this.stateRandomPodcasts().isLoading);
  readonly errorMessageRandomPodcasts = computed(() => this.stateRandomPodcasts().errorMessage);
  readonly statusRequestMessageRandomPodcasts = computed(() => this.stateRandomPodcasts().statusRequest);
  readonly totalRandomItems = computed(() => this.stateRandomPodcasts().totalItems);

  readonly recommendedPodcastsResponse = computed(() => this.stateRecommendedPodcasts().recommendedPodcastsResponse);
  readonly isLoadingRecommendedPodcasts = computed(() => this.stateRecommendedPodcasts().isLoading);
  readonly errorMessageRecommendedPodcasts = computed(() => this.stateRecommendedPodcasts().errorMessage);
  readonly statusRequestRecommendedPodcast = computed(() => this.stateRecommendedPodcasts().statusRequest);
  readonly totalRecommendedItems = computed(() => this.stateRecommendedPodcasts().totalItems);

  readonly podcastCategories = computed(() => this.statePodcastCategories().categoriesResponse?.data || []);
  readonly isLoadingPodcastCategories = computed(() => this.statePodcastCategories().isLoading);
  readonly errorMessagePodcastCategories = computed(() => this.statePodcastCategories().errorMessage);
  readonly statusRequestPodcastCategories = computed(() => this.statePodcastCategories().statusRequest);

  readonly isFavouriteLoading = (id: string): boolean => this.loadingFavouritesIds().has(id);

  // Pagination
  private paginationParams: IPaginationParameters = { ...defaultPaginationParameters };

  // Fetch All Podcasts
  fetchAllPodcasts(filter?: boolean, notLoading?: boolean): void {
    Logger.debug('Initiating all podcasts fetch...');
    if (!notLoading) {
      if (filter) {
        this.updateAllPodcastsState({ isLoadingFilter: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingFilterAllPodcasts') });
      } else {
        this.updateAllPodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingAllPodcasts') });
      }
    }

    this._PodcastsApiClientProvider.getAll(this.paginationParams)
      .pipe(
        tap((response: IPodcastsListingResponseDto) => this.processAllPodcastsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchAllError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeAllFetch(filter))
      )
      .subscribe();
  }

  fetchAllPodcastsWithPagination(page: number = 1, itemsPerPage: number = 2, notLoading?: boolean): void {
    Logger.debug('Initiating all podcasts fetch with pagination...', { page, itemsPerPage });
    if (!notLoading) {
      this.updateAllPodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingAllPodcasts') });
    }

    this._PodcastsApiClientProvider.getAll(this.paginationParams)
      .pipe(
        tap((response: IPodcastsListingResponseDto) => this.processAllPodcastsResponseWithPagination(response, page, itemsPerPage)),
        catchError((error: ApiError) => {
          this.handleFetchAllError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeAllFetch())
      )
      .subscribe();
  }

  private processAllPodcastsResponse(response: IPodcastsListingResponseDto): void {
    if (response && response.data?.podcasts && response.data.podcasts.length > 0) {
      this.updateAllPodcastsState({
        allPodcastsResponse: response,
        totalItems: response.data.podcasts.length,
        errorMessage: ''
      });
      Logger.debug('All podcasts fetched successfully:', response);
    } else {
      this.updateAllPodcastsState({
        allPodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_podcasts_in_category'
      });
    }
  }

  private processAllPodcastsResponseWithPagination(response: IPodcastsListingResponseDto, page: number = 1, itemsPerPage: number = 2): void {
    if (response && response.data?.podcasts && response.data.podcasts.length > 0) {
      // Calculate start and end indices for pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Slice the data based on pagination
      const paginatedData = response.data.podcasts.slice(startIndex, endIndex);

      // Create new response with paginated data
      const paginatedResponse = {
        ...response,
        data: {
          ...response.data,
          podcasts: paginatedData
        }
      };

      this.updateAllPodcastsState({
        allPodcastsResponse: paginatedResponse,
        totalItems: response.data.podcasts.length, // Keep original total for pagination calculation
        errorMessage: ''
      });
      Logger.debug('All podcasts fetched successfully with pagination:', { original: response.data.podcasts.length, paginated: paginatedData.length, page, itemsPerPage });
    } else {
      this.updateAllPodcastsState({
        allPodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_podcasts_in_category'
      });
    }
  }

  private handleFetchAllError(error: ApiError): void {
    Logger.error('Error fetching all podcasts:', error);
    handleApiErrors(error);
    this.updateAllPodcastsState({ errorMessage: this._LocalizationService.translateTextFromJson('general.errorLoadingPodcasts') });

    this._ToastService.add({
      severity: 'error',
      summary: this._LocalizationService.translateTextFromJson('general.error'),
      detail: error?.message || this._LocalizationService.translateTextFromJson('general.errorLoadingPodcasts'),
      life: 5000
    });

  }

  private finalizeAllFetch(filter?: boolean): void {
    if (filter) {
      this.updateAllPodcastsState({ isLoadingFilter: false });
    } else {
      this.updateAllPodcastsState({ isLoading: false });
    }
  }

  // Fetch Favorite Podcasts
  fetchFavouritePodcasts(): void {
    // Prevent multiple simultaneous calls
    if (this.isLoadingFavouritePodcasts()) {
      Logger.debug('PodcastsMainPageFacade: Already loading favourites, skipping duplicate call');
      return;
    }

    Logger.debug('🔄 PodcastsMainPageFacade: Initiating favorite podcasts fetch...');
    this.updateFavouritePodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingFavoritePodcasts') });

    this._PodcastsApiClientProvider.getFavorites()
      .pipe(
        tap((response: IFavoritePodcastsListingResponseDto) => this.processFavouritePodcastsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchFavouriteError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeFavouriteFetch())
      )
      .subscribe();
  }

  private processFavouritePodcastsResponse(response: IFavoritePodcastsListingResponseDto): void {
    Logger.debug('✅ PodcastsMainPageFacade: Processing favourite podcasts response...');
    if (response && response.data && response.data.length > 0) {
      this.updateFavouritePodcastsState({
        favouritePodcastsResponse: response,
        totalItems: response.data.length,
        statusRequest: response.status,
        errorMessage: null
      });
      Logger.debug('✅ PodcastsMainPageFacade: Favorite podcasts fetched successfully, count:', response.data.length);
      Logger.debug('✅ PodcastsMainPageFacade: Response data:', response.data);
    } else {
      this.updateFavouritePodcastsState({
        favouritePodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_favorite_podcasts'
      });
    }
  }

  private handleFetchFavouriteError(error: ApiError): void {
    Logger.error('Error fetching favorite podcasts:', error);
    handleApiErrors(error);
    this.updateFavouritePodcastsState({ errorMessage: this._LocalizationService.translateTextFromJson('general.errorLoadingFavoritePodcasts') });

    this._ToastService.add({
      severity: 'error',
      summary: this._LocalizationService.translateTextFromJson('general.error'),
      detail: error?.message || this._LocalizationService.translateTextFromJson('general.failedUpdateFavoriteStatus'),
      life: 5000
    });

  }

  private finalizeFavouriteFetch(): void {
    this.updateFavouritePodcastsState({ isLoading: false });
  }

  // Fetch Random Podcasts
  fetchRandomPodcasts(notLoading?: boolean): void {
    Logger.debug('Initiating random podcasts fetch...');
    if (!notLoading) {
      this.updateRandomPodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingRandomPodcasts') });
    }

    this._PodcastsApiClientProvider.getRandom()
      .pipe(
        tap((response: IRandomPodcastsListingResponseDto) => this.processRandomPodcastsResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchRandomError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeRandomFetch())
      )
      .subscribe();
  }

  fetchRandomPodcastsWithPagination(page: number = 1, itemsPerPage: number = 4, notLoading?: boolean): void {
    Logger.debug('Initiating random podcasts fetch with pagination...', { page, itemsPerPage });
    if (!notLoading) {
      this.updateRandomPodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingRandomPodcasts') });
    }

    this._PodcastsApiClientProvider.getRandom()
      .pipe(
        tap((response: IRandomPodcastsListingResponseDto) => this.processRandomPodcastsResponseWithPagination(response, page, itemsPerPage)),
        catchError((error: ApiError) => {
          this.handleFetchRandomError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeRandomFetch())
      )
      .subscribe();
  }

  private processRandomPodcastsResponse(response: IRandomPodcastsListingResponseDto): void {
    if (response && response.data && response.data.length > 0) {
      this.updateRandomPodcastsState({
        randomPodcastsResponse: response,
        totalItems: response.data.length,
        errorMessage: ''
      });
      Logger.debug('Random podcasts fetched successfully:', response);
    } else {
      this.updateRandomPodcastsState({
        randomPodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_random_podcasts'
      });
    }
  }

  private processRandomPodcastsResponseWithPagination(response: IRandomPodcastsListingResponseDto, page: number = 1, itemsPerPage: number = 4): void {
    if (response && response.data && response.data.length > 0) {
      // Calculate start and end indices for pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Slice the data based on pagination
      const paginatedData = response.data.slice(startIndex, endIndex);

      // Create new response with paginated data
      const paginatedResponse = {
        ...response,
        data: paginatedData
      };

      this.updateRandomPodcastsState({
        randomPodcastsResponse: paginatedResponse,
        totalItems: response.data.length, // Keep original total for pagination calculation
        errorMessage: ''
      });
      Logger.debug('Random podcasts fetched successfully with pagination:', { original: response.data.length, paginated: paginatedData.length, page, itemsPerPage });
    } else {
      this.updateRandomPodcastsState({
        randomPodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_random_podcasts'
      });
    }
  }

  private handleFetchRandomError(error: ApiError): void {
    Logger.error('Error fetching random podcasts:', error);
    handleApiErrors(error);
    this.updateRandomPodcastsState({ errorMessage: this._LocalizationService.translateTextFromJson('general.errorLoadingRandomPodcasts') });

    this._ToastService.add({
      severity: 'error',
      summary: this._LocalizationService.translateTextFromJson('general.error'),
      detail: error?.message || this._LocalizationService.translateTextFromJson('general.errorLoadingRandomPodcasts'),
      life: 5000
    });

  }

  private finalizeRandomFetch(): void {
    this.updateRandomPodcastsState({ isLoading: false });
  }

  // Fetch Recommended Podcasts
  fetchRecommendedPodcasts(page: number = 1, itemsPerPage: number = 4, notLoading?: boolean): void {
    Logger.debug('Initiating recommended podcasts fetch...', { page, itemsPerPage });
    if (!notLoading) {
      this.updateRecommendedPodcastsState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingRecommendedPodcasts') });
    }

    this._PodcastsApiClientProvider.getRecommended()
      .pipe(
        tap((response: IRecommendedPodcastsListingResponseDto) => this.processRecommendedPodcastsResponse(response, page, itemsPerPage)),
        catchError((error: ApiError) => {
          this.handleFetchRecommendedError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizeRecommendedFetch())
      )
      .subscribe();
  }

  private processRecommendedPodcastsResponse(response: IRecommendedPodcastsListingResponseDto, page: number = 1, itemsPerPage: number = 4): void {
    if (response && response.data && response.data.length > 0) {
      // Calculate start and end indices for pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Slice the data based on pagination
      const paginatedData = response.data.slice(startIndex, endIndex);

      // Create new response with paginated data
      const paginatedResponse = {
        ...response,
        data: paginatedData
      };

      this.updateRecommendedPodcastsState({
        recommendedPodcastsResponse: paginatedResponse,
        totalItems: response.data.length, // Keep original total for pagination calculation
        errorMessage: ''
      });
      Logger.debug('Recommended podcasts fetched successfully:', { original: response.data.length, paginated: paginatedData.length, page, itemsPerPage });
    } else {
      this.updateRecommendedPodcastsState({
        recommendedPodcastsResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_recommended_podcasts'
      });
      this._ToastService.add({
        severity: 'error',
        summary: this._LocalizationService.translateTextFromJson('general.error'),
        detail: response?.message || this._LocalizationService.translateTextFromJson('general.failedUpdateFavoriteStatus'),
        life: 5000
      });
    }
  }

  private handleFetchRecommendedError(error: ApiError): void {
    Logger.error('Error fetching recommended podcasts:', error);
    handleApiErrors(error);
    this.updateRecommendedPodcastsState({ errorMessage: this._LocalizationService.translateTextFromJson('general.errorLoadingRecommendedPodcasts') });

    this._ToastService.add({
      severity: 'error',
      summary: this._LocalizationService.translateTextFromJson('general.error'),
      detail: error?.message || this._LocalizationService.translateTextFromJson('general.errorLoadingRecommendedPodcasts'),
      life: 5000
    });


  }

  private finalizeRecommendedFetch(): void {
    this.updateRecommendedPodcastsState({ isLoading: false });

  }

  // Fetch Podcast Categories
  fetchPodcastCategories(): void {
    Logger.debug('Initiating podcast categories fetch...');
    this.updatePodcastCategoriesState({ isLoading: true, errorMessage: this._LocalizationService.translateTextFromJson('general.loadingPodcastCategories') });

    this._PodcastsApiClientProvider.getCategories()
      .pipe(
        tap((response: IPodcastCategoriesListingResponseDto) => this.processPodcastCategoriesResponse(response)),
        catchError((error: ApiError) => {
          this.handleFetchPodcastCategoriesError(error);
          return EMPTY;
        }),
        finalize(() => this.finalizePodcastCategoriesFetch())
      )
      .subscribe();
  }

  private processPodcastCategoriesResponse(response: IPodcastCategoriesListingResponseDto): void {
    if (response && response.data && response.data.length > 0) {
      this.updatePodcastCategoriesState({
        categoriesResponse: response,
        errorMessage: ''
      });
      Logger.debug('Podcast categories fetched successfully:', response);
    } else {
      this.updatePodcastCategoriesState({
        categoriesResponse: null,
        statusRequest: response.status,
        errorMessage: 'podcast_no_podcast_categories'
      });
    }
  }

  private handleFetchPodcastCategoriesError(error: ApiError): void {
    Logger.error('Error fetching podcast categories:', error);
    handleApiErrors(error);
    this.updatePodcastCategoriesState({ errorMessage: this._LocalizationService.translateTextFromJson('general.errorLoadingPodcastCategories') });

    this._ToastService.add({
      severity: 'error',
      summary: this._LocalizationService.translateTextFromJson('general.error'),
      detail: error?.message || this._LocalizationService.translateTextFromJson('general.errorLoadingPodcastCategories'),
      life: 5000
    });


  }

  private finalizePodcastCategoriesFetch(): void {
    this.updatePodcastCategoriesState({ isLoading: false });

  }

  // Toggle Favorite
  toggleItemFavourite(podcast: IPodcast, type?: string): void {
    Logger.debug('Toggle Item Favourite:', { item: podcast, type: type });
    const originalIsBookmarked = podcast.is_bookmarked;

    // Add podcast ID to shimmer loading set
    const currentLoading = new Set(this.loadingFavouritesIds());
    currentLoading.add(String(podcast.id));
    this.loadingFavouritesIds.set(currentLoading);

    // Optimistically update the UI
    this.updatePodcastBookmarkStatus(podcast.id, !originalIsBookmarked);

    this._PodcastsApiClientProvider.toggleFavorite(podcast.id)
      .pipe(
        tap((response: ITogglePodcastFavoriteResponseDto) => {
          if (response && response.status) {
            Logger.debug('Toggle Item Favourite Podcast fetched successfully:', response);
            // Don't fetch favourites here to avoid duplicate calls
            // The toggle-favorite-podcast.facade will handle the refresh
          } else {
            Logger.debug('Toggle Item Favourite Podcast fetch failed:', response.message);
            this.updatePodcastBookmarkStatus(podcast.id, originalIsBookmarked); // Revert optimistic update
            this._ToastService.add({
              severity: 'error',
              summary: this._LocalizationService.translateTextFromJson('general.error'),
              detail: response?.message || this._LocalizationService.translateTextFromJson('general.failedUpdateFavoriteStatus'),
              life: 5000
            });
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error toggling favorite status:', error);
          handleApiErrors(error);
          this._ToastService.add({
            severity: 'error',
            summary: this._LocalizationService.translateTextFromJson('general.error'),
            detail: error?.message ?? this._LocalizationService.translateTextFromJson('general.errorUpdatingFavoriteStatus'),
            life: 5000
          });

          // Revert optimistic update on failure
          this.updatePodcastBookmarkStatus(podcast.id, originalIsBookmarked);

          return EMPTY;
        }),
        finalize(() => {
          // Remove podcast ID from shimmer loading set
          const updatedLoading = new Set(this.loadingFavouritesIds());
          updatedLoading.delete(String(podcast.id));
          this.loadingFavouritesIds.set(updatedLoading);


        })
      )
      .subscribe();
  }

  // Update category filter
  updateCategoryFilter(categoryId: number | null): void {
    this.paginationParams.category_id = categoryId;
  }

  // Refresh all lists
  refreshAllPodcastLists(): void {
    Logger.debug('Refreshing all podcast lists...');
    this.fetchFavouritePodcasts();
  }

  // Helper function to update podcast bookmark status across all lists
  private updatePodcastBookmarkStatus(podcastId: number, isBookmarked: boolean): void {
    console.log('Updating bookmark status for podcast ID:', podcastId, 'to', isBookmarked);

    // Update most_visit if it matches
    this.stateAllPodcasts.update(state => {
      if (state.allPodcastsResponse?.data?.most_visit?.id === podcastId) {
        return {
          ...state,
          allPodcastsResponse: {
            ...state.allPodcastsResponse,
            data: {
              ...state.allPodcastsResponse.data,
              most_visit: { ...state.allPodcastsResponse.data.most_visit, is_bookmarked: isBookmarked }
            }
          }
        };
      }
      return state;
    });

    // Update 'all podcasts' list
    this.stateAllPodcasts.update(state => {
      const updatedPodcasts = state.allPodcastsResponse?.data?.podcasts?.map(p =>
        p.id === podcastId ? { ...p, is_bookmarked: isBookmarked } : p
      );
      return {
        ...state,
        allPodcastsResponse: updatedPodcasts ? {
          ...state.allPodcastsResponse!,
          data: { ...state.allPodcastsResponse!.data, podcasts: updatedPodcasts }
        } : state.allPodcastsResponse
      };
    });

    // Update 'recommended podcasts' list
    this.stateRecommendedPodcasts.update(state => {
      const updatedRecommended = state.recommendedPodcastsResponse?.data?.map(p =>
        p.id === podcastId ? { ...p, is_bookmarked: isBookmarked } : p
      );
      return {
        ...state,
        recommendedPodcastsResponse: updatedRecommended ? {
          ...state.recommendedPodcastsResponse!,
          data: updatedRecommended
        } : state.recommendedPodcastsResponse
      };
    });

    // Update 'random podcasts' list
    this.stateRandomPodcasts.update(state => {
      const updatedRandom = state.randomPodcastsResponse?.data?.map(p =>
        p.id === podcastId ? { ...p, is_bookmarked: isBookmarked } : p
      );
      return {
        ...state,
        randomPodcastsResponse: updatedRandom ? {
          ...state.randomPodcastsResponse!,
          data: updatedRandom
        } : state.randomPodcastsResponse
      };
    });
  }

  // Utility functions to update state immutably
  private updateAllPodcastsState(updates: Partial<AllPodcastsListState>): void {
    this.stateAllPodcasts.update(state => ({ ...state, ...updates }));
  }

  private updateFavouritePodcastsState(updates: Partial<FavouritePodcastsListState>): void {
    this.stateFavouritePodcasts.update(state => ({ ...state, ...updates }));
  }

  private updateRandomPodcastsState(updates: Partial<RandomPodcastsListState>): void {
    this.stateRandomPodcasts.update(state => ({ ...state, ...updates }));
  }

  private updateRecommendedPodcastsState(updates: Partial<RecommendedPodcastsListState>): void {
    this.stateRecommendedPodcasts.update(state => ({ ...state, ...updates }));
  }

  private updatePodcastCategoriesState(updates: Partial<PodcastCategoriesListState>): void {
    this.statePodcastCategories.update(state => ({ ...state, ...updates }));
  }

  /** Reset favourite podcasts state */
  resetFavouritePodcasts(): void {
    this.updateFavouritePodcastsState({
      favouritePodcastsResponse: null,
      isLoading: false,
      errorMessage: null,
      statusRequest: false,
      totalItems: 0
    });
  }
  resetAllPodcasts(): void {
    this.updateAllPodcastsState({
      allPodcastsResponse: null,
      isLoading: false,
      errorMessage: null,
      statusRequest: false,
      totalItems: 0
    });
  }
  resetRecommendedPodcasts(): void {
    this.updateRecommendedPodcastsState({
      recommendedPodcastsResponse: null,
      isLoading: false,
      errorMessage: null,
      statusRequest: false,
      totalItems: 0
    });
  }
}
