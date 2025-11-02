import {
  inject,
  Injectable,
  signal,
  computed,
} from '@angular/core';
import { IPodcastsApiClient, PodcastsApiClientProvider } from '../clients';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { Logger, ApiError, handleApiErrors } from '../../../common';
import { ToastService, LocalizationService } from '../../../shared';
import { ITogglePodcastFavoriteResponseDto } from '../dtos';
import { PodcastsMainPageFacade } from './podcasts-main-page.facade';

// Interface for responsive pagination parameters
interface ResponsivePaginationParams {
  recommendedPage: number;
  recommendedItemsPerPage: number;
  explorePage: number;
  exploreItemsPerPage: number;
  selectionsPage: number;
  selectionsItemsPerPage: number;
}

interface LastTogglePodcastResultState {
  response: ITogglePodcastFavoriteResponseDto | null;
  success: boolean;
  error: string | null;
  podcastId: number | null;
}

const initialLastTogglePodcastResultState: LastTogglePodcastResultState = {
  response: null,
  success: false,
  error: null,
  podcastId: null,
};

@Injectable({ providedIn: 'root' })
export class ToggleFavoritePodcastFacade {
  private readonly _apiClient: IPodcastsApiClient = inject(PodcastsApiClientProvider).getClient();
  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);
  private readonly _podcastsMainPageFacade = inject(PodcastsMainPageFacade);
  readonly loadingPodcastIds = signal<Set<number>>(new Set<number>());
  private readonly _lastToggleResultState = signal<LastTogglePodcastResultState>(initialLastTogglePodcastResultState);

  // Callback to get current responsive pagination parameters
  private _responsivePaginationCallback: (() => ResponsivePaginationParams) | null = null;

  readonly lastToggleResponse = computed(() => this._lastToggleResultState().response);
  readonly lastToggleSuccess = computed(() => this._lastToggleResultState().success);
  readonly lastToggleError = computed(() => this._lastToggleResultState().error);
  readonly lastToggledPodcastId = computed(() => this._lastToggleResultState().podcastId);

  // Method to register responsive pagination callback
  setResponsivePaginationCallback(callback: () => ResponsivePaginationParams): void {
    this._responsivePaginationCallback = callback;
  }

  togglePodcastFavorite(podcastId: number): Observable<ITogglePodcastFavoriteResponseDto> {
    this.loadingPodcastIds.update(ids => new Set(ids).add(podcastId));
    this._lastToggleResultState.set({ ...initialLastTogglePodcastResultState, podcastId });

    return this._apiClient.toggleFavorite(podcastId).pipe(
      tap((response: ITogglePodcastFavoriteResponseDto) => {
        if (response?.status) {
          this._lastToggleResultState.set({
            response,
            success: true,
            error: null,
            podcastId,
          });
          // Only refresh data if user is on podcasts page to avoid unnecessary API calls
          const currentUrl = window.location.pathname;
          if (currentUrl.includes('podcasts')) {
            Logger.debug('ToggleFavoritePodcastFacade: Refreshing podcasts data after toggle...');

            // Use responsive pagination parameters if available
            if (this._responsivePaginationCallback) {
              const params = this._responsivePaginationCallback();
              this._podcastsMainPageFacade.fetchFavouritePodcasts();
              this._podcastsMainPageFacade.fetchAllPodcastsWithPagination(params.explorePage, params.exploreItemsPerPage);
              this._podcastsMainPageFacade.fetchRecommendedPodcasts(params.recommendedPage, params.recommendedItemsPerPage, true);
              this._podcastsMainPageFacade.fetchRandomPodcastsWithPagination(params.selectionsPage, params.selectionsItemsPerPage);
            } else {
              // Fallback to default values - only fetch favourites to avoid excessive calls
              this._podcastsMainPageFacade.fetchFavouritePodcasts();
            }
          } else {
            Logger.debug('ToggleFavoritePodcastFacade: User not on podcasts page, skipping data refresh');
          }
        } else {
          const errorMessage = response?.message || this._localizationService.translateTextFromJson('general.failedUpdateFavoriteStatus');
          this._toastService.add({
            severity: 'error',
            summary: this._localizationService.translateTextFromJson('general.error'),
            detail: errorMessage,
            life: 5000,
          });
          this._lastToggleResultState.set({
            response,
            success: false,
            error: errorMessage,
            podcastId,
          });
          throw new Error(errorMessage);
        }
      }),
      catchError((error: ApiError) => {
        const errorMessage = error?.message || this._localizationService.translateTextFromJson('general.errorUpdatingFavoriteStatus');
        handleApiErrors(error);
        this._toastService.add({
          severity: 'error',
          summary: this._localizationService.translateTextFromJson('general.error'),
          detail: errorMessage,
          life: 5000,
        });
        this._lastToggleResultState.set({
          response: { data: null, status: false, message: errorMessage },
          success: false,
          error: errorMessage,
          podcastId,
        });
        return EMPTY;
      }),
      finalize(() => {
        this.loadingPodcastIds.update(ids => {
          const updated = new Set(ids);
          updated.delete(podcastId);
          return updated;
        });
      }),
    );
  }

  resetLastToggleResultState(): void {
    this._lastToggleResultState.set(initialLastTogglePodcastResultState);
  }
}
