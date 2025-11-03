import {
  inject,
  Injectable,
  signal,
  computed,
  PLATFORM_ID,
  makeStateKey,
  TransferState,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IFavoritesArticlesListingResponseDto } from '../dtos';
import {
  ArticlesApiClientProvider,
} from '../clients';
import {
  FavoriteArticlesListState,
  initialFavoriteArticlesListState,
} from '../models/favorite-articles.models'; // Assuming you'll update this model
import {
  Logger,
  ApiError,
  handleApiErrors,
  IPaginationParameters,
  defaultPaginationParameters,
} from '../../../common';

const FAVORITE_ARTICLES_STATE_KEY = makeStateKey<FavoriteArticlesListState>('favoriteArticles');

@Injectable({ providedIn: 'root' })
export class FavoriteArticlesFacade {
  private readonly _apiClient = inject(ArticlesApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _state = signal<FavoriteArticlesListState>(initialFavoriteArticlesListState);

  readonly favoriteArticles = computed(() => this._state().articles);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly status = computed(() => this._state().status);
  // Add new computed properties for pagination
  readonly currentPage = computed(() => this._state().currentPage);
  readonly totalItems = computed(() => this._state().totalItems);
  readonly totalPages = computed(() => this._state().totalPages);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<FavoriteArticlesListState>(
      //   FAVORITE_ARTICLES_STATE_KEY,
      //   initialFavoriteArticlesListState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating favorite articles from TransferState', cachedState);
      //   this._updateState(cachedState);
      //   this._transferState.remove(FAVORITE_ARTICLES_STATE_KEY);
      // }
    }
  }

  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 3 };

  fetchFavoriteArticles(page: number = this._paginationParams.page || 1, filter: boolean = false, search: string | undefined = this._paginationParams.search): void {
    Logger.debug('Fetching favorite articles...');

    this._paginationParams.page = page;
    this._paginationParams.search = search;
    this._updateState({
      isLoading: !filter,
      currentPage: page, // Update currentPage when fetching
      errorMessage: null,
    });

    const cached = this._transferState.get<FavoriteArticlesListState>(
      FAVORITE_ARTICLES_STATE_KEY,
      null as any
    );

    if (isPlatformBrowser(this._platformId) && cached?.articles?.length > 0) {
      Logger.debug('Using cached favorite articles from TransferState');
      this._updateState({
        articles: cached.articles,
        status: cached.status,
        isLoading: false,
        errorMessage: null,
        // Add these keys from cached state
        currentPage: cached.currentPage,
        totalItems: cached.totalItems,
        totalPages: cached.totalPages,
      });
      this._transferState.remove(FAVORITE_ARTICLES_STATE_KEY);
      return;
    }

    this._apiClient.FavoriteArticles(this._paginationParams)
      .pipe(
        tap((response: IFavoritesArticlesListingResponseDto) => {
          if (response?.data?.data?.length > 0) {
            const total = response.data.meta.total;
            const currentPage = response.data.meta.current_page;
            const perPage = response.data.meta.per_page;
            const totalPages = Math.ceil(total / perPage);

            this._updateState({
              articles: response.data.data,
              status: response.status,
              errorMessage: null,
              currentPage: currentPage,
              totalItems: total,
              totalPages: totalPages,
            });
          } else {
            // Empty response is not an error
            this._updateState({
              articles: [],
              status: response.status,
              errorMessage: null,
              currentPage: 1,
              totalItems: 0,
              totalPages: 1,
            });
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(FAVORITE_ARTICLES_STATE_KEY, this._state());
            Logger.debug('Stored favorite articles in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          this._updateState({
            articles: [],
            status: false,
            errorMessage: '🚨 Error loading favorite articles. Please try again later.',
            currentPage: 1, // Reset on error
            totalItems: 0, // Reset on error
            totalPages: 1, // Reset on error
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => this._updateState({ isLoading: false }))
      )
      .subscribe();
  }

  private _updateState(updates: Partial<FavoriteArticlesListState>): void {
    this._state.update(state => ({ ...state, ...updates }));
  }

  updateFavoriteArticleBookmark(articleId: number, isBookmarked: boolean): void {
    this._state.update(state => {
      const updatedArticles = state.articles.map(article =>
        article.id === articleId ? { ...article, is_bookmark: isBookmarked } : article
      );

      return {
        ...state,
        articles: updatedArticles,
      };
    });
  }
  resetFavoriteArticles(): void {
    this._state.set(initialFavoriteArticlesListState);
  }
}
