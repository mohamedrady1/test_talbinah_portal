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
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { IArticlesListingResponseDto } from '../dtos';
import { ArticlesApiClientProvider, IArticlesApiClient } from '../clients';
import { initialArticlesFeatureState, ArticlesFeatureState, ArticlesListState } from '../models';
import { IPaginationParameters, defaultPaginationParameters, Logger, ApiError, handleApiErrors } from '../../../common';

const ALL_ARTICLES_STATE_KEY = makeStateKey<ArticlesFeatureState>('allArticles');

@Injectable({
  providedIn: 'root'
})
export class ArticlesFacade {
  // --- Dependencies ---
  private readonly _apiClient: IArticlesApiClient = inject(ArticlesApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _featureState = signal<ArticlesFeatureState>(initialArticlesFeatureState);

  // --- Pagination & Search Parameters ---
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 15 };

  // --- Selectors (Computed) ---
  readonly articlesResponse = computed(() => this._featureState().articles.response);
  readonly isLoading = computed(() => this._featureState().articles.isLoading);
  readonly isFiltering = computed(() => this._featureState().articles.isFiltering);
  readonly errorMessage = computed(() => this._featureState().articles.errorMessage);
  readonly totalItems = computed(() => this._featureState().articles.totalItems);
  readonly currentPage = computed(() => this._featureState().articles.currentPage);
  readonly totalPages = computed(() => this._featureState().articles.totalPages);
  readonly searchSuggestions = computed(() => this._featureState().articles.searchSuggestions);


  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<ArticlesFeatureState>(ALL_ARTICLES_STATE_KEY, initialArticlesFeatureState);
      // if (cachedState) {
      //   Logger.debug('Hydrating articles from TransferState', cachedState);
      //   this._updateArticlesListState(cachedState.articles);
      //   this._transferState.remove(ALL_ARTICLES_STATE_KEY);
      // }
    }
  }

  // --- Public Methods ---

  /**
   * Orchestrates the initial loading or full refresh of articles by resetting
   * pagination/search state and then fetching articles.
   */
  loadArticles(): void {
    Logger.debug('Loading articles: Resetting state and fetching...');
    this.resetPaginationAndSearchState(); // Reset filters and pagination
    this.fetchArticles(); // Fetch articles with default/reset parameters
  }

  fetchArticles(page: number = this._paginationParams.page || 1, filter: boolean = false, search: string | undefined = this._paginationParams.search): void {
    Logger.debug(`Fetching articles - Page: ${page}, Filter: ${filter}, Search: ${search || 'N/A'}`);

    this._paginationParams.page = page;
    this._paginationParams.search = search;

    this._updateArticlesListState({
      isLoading: !filter,
      isFiltering: filter,
      currentPage: page,
      errorMessage: null,
    });

    // const cached = this._transferState.get<ArticlesFeatureState>(ALL_ARTICLES_STATE_KEY, null as any);
    // if (isPlatformBrowser(this._platformId) && cached && !filter && !search) {
    //   Logger.debug('Using cached articles from TransferState');
    //   this._updateArticlesListState({
    //     response: cached.articles.response,
    //     isLoading: false,
    //     isFiltering: false,
    //     currentPage: cached.articles.currentPage,
    //     totalItems: cached.articles.totalItems,
    //     totalPages: cached.articles.totalPages,
    //     searchSuggestions: cached.articles.searchSuggestions,
    //   });
    //   this._transferState.remove(ALL_ARTICLES_STATE_KEY);
    //   return;
    // }

    this._apiClient
      .getAll(this._paginationParams)
      .pipe(
        tap((response: IArticlesListingResponseDto) => {
          if (response && response.data && response.data.data.length > 0) {
            const titles = response.data.data.map(article => article.title).filter(Boolean);
            const total = response.data.meta.total;
            const perPage = this._paginationParams.per_page!;
            const totalPages = Math.ceil(total / perPage);

            this._updateArticlesListState({
              response: response,
              totalItems: total,
              totalPages: totalPages,
              searchSuggestions: titles,
              errorMessage: null,
            });
          } else {
            // Empty response is not an error, just set response to null or empty
            this._updateArticlesListState({
              response: response || null,
              totalItems: 0,
              totalPages: 1,
              searchSuggestions: [],
              errorMessage: null,
            });
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(ALL_ARTICLES_STATE_KEY, this._featureState());
            Logger.debug('Stored articles in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          this._updateArticlesListState({
            errorMessage: '🚨 Error loading articles. Please try again later.',
            response: null,
            searchSuggestions: [],
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => {
          this._updateArticlesListState({
            isLoading: false,
            isFiltering: false,
          });
        })
      )
      .subscribe();
  }

  // Method to update pagination parameters from the component
  updatePaginationParams(params: Partial<IPaginationParameters>): void {
    this._paginationParams = { ...this._paginationParams, ...params };
  }

  // Method to reset pagination parameters and state for search/clear
  resetPaginationAndSearchState(): void {
    this._paginationParams = { ...defaultPaginationParameters, per_page: 15 };
    this._updateArticlesListState({
      currentPage: 1,
      totalPages: 1,
      searchSuggestions: [],
      response: null,
      totalItems: 0,
      errorMessage: null,
    });
    Logger.debug('Articles pagination and search state has been reset');
  }

  // --- Private Utility Method ---
  private _updateArticlesListState(updates: Partial<ArticlesListState>): void {
    this._featureState.update(state => ({
      ...state,
      articles: {
        ...state.articles,
        ...updates
      }
    }));
  }
  updateArticleBookmark(articleId: number, isBookmarked: boolean): void {
    this._featureState.update(state => {
      const response = state.articles.response;

      if (!response?.data?.data?.length) return state;

      const updatedData = response.data.data.map(article =>
        article.id === articleId ? { ...article, is_bookmark: isBookmarked } : article
      );

      return {
        ...state,
        articles: {
          ...state.articles,
          response: {
            ...response,
            data: {
              ...response.data,
              data: updatedData
            }
          }
        }
      };
    });
  }
}
