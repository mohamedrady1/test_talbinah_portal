import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { IFavoritePodcastsListingResponseDto } from '../dtos';
import { PodcastsApiClientProvider } from '../clients';
import { LocalizationService, ToastService } from '../../../shared';
import { ApiError, defaultPaginationParameters, IPaginationParameters, Logger } from '../../../common';

interface FavouritePodcastsListState {
  favouritePodcastsResponse: IFavoritePodcastsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class FavoritePodcastsFacade {
  private readonly _api = inject(PodcastsApiClientProvider).getClient();
  private readonly _toast = inject(ToastService);
  private readonly _localization = inject(LocalizationService);

  private readonly state = signal<FavouritePodcastsListState>({
    favouritePodcastsResponse: null,
    isLoading: false,
    errorMessage: null,
    totalItems: 0,
    currentPage: 1,
    status: false
  });

  private readonly _paginationParams: IPaginationParameters = {
    ...defaultPaginationParameters,
    per_page: 10
  };

  readonly response = computed(() => this.state().favouritePodcastsResponse);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly totalItems = computed(() => this.state().totalItems);
  readonly currentPage = computed(() => this.state().currentPage);
  readonly status = computed(() => this.state().status);
  fetchFavorites(page: number = 1, search?: string): void {
    this._paginationParams.page = page;
    this._paginationParams.search = search;

    this.updateState({ isLoading: true, errorMessage: null, currentPage: page, status: false });

    this._api.getFavorites(this._paginationParams)
      .pipe(
        tap(response => {
          this.updateState({
            favouritePodcastsResponse: response,
            totalItems: response?.data?.length,
            errorMessage: ''
          });
          this.updateState({ status: true });
        }),
        catchError((err: ApiError) => {
          Logger.error('Favorite podcasts fetch failed', err);
          this._toast.add({
            severity: 'error',
            summary: this._localization.translateTextFromJson('general.error'),
            detail: this._localization.translateTextFromJson('general.errorLoadingFavoritePodcasts'),
            life: 5000
          });
          this.updateState({
            errorMessage: this._localization.translateTextFromJson('general.errorLoadingFavoritePodcasts')
          });
          this.updateState({ status: false });
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  /**
   * Fetches favorite podcasts without pagination parameters
   * Used for refreshing data after login without query parameters
   */
  fetchFavoritesWithoutPagination(): void {
    this.updateState({ isLoading: true, errorMessage: null, status: false });

    this._api.getFavorites() // بدون pagination parameters
      .pipe(
        tap(response => {
          this.updateState({
            favouritePodcastsResponse: response,
            totalItems: response?.data?.length,
            errorMessage: ''
          });
          this.updateState({ status: true });
        }),
        catchError((err: ApiError) => {
          Logger.error('Favorite podcasts fetch failed', err);
          this._toast.add({
            severity: 'error',
            summary: this._localization.translateTextFromJson('general.error'),
            detail: this._localization.translateTextFromJson('general.errorLoadingFavoritePodcasts'),
            life: 5000
          });
          this.updateState({
            errorMessage: this._localization.translateTextFromJson('general.errorLoadingFavoritePodcasts')
          });
          this.updateState({ status: false });
          return EMPTY;
        }),
        finalize(() => this.updateState({ isLoading: false }))
      )
      .subscribe();
  }

  private updateState(update: Partial<FavouritePodcastsListState>) {
    this.state.update(state => ({ ...state, ...update }));
  }
}
