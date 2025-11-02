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
import {
  Logger,
  ApiError,
  handleApiErrors,
} from '../../../common';
import { IMostViewedArticlesResponseDto } from '../dtos';
import { ArticlesApiClientProvider } from '../clients';
import { initialMostViewedArticlesListState, MostViewedArticlesListState } from '../models';

const MOST_VIEWED_ARTICLES_STATE_KEY = makeStateKey<MostViewedArticlesListState>('mostViewedArticles');

@Injectable({ providedIn: 'root' })
export class MostViewedArticlesFacade {
  // --- Dependencies ---
  // We'll use CollectionApiClientProvider here as per your original method signature
  private readonly _apiClient = inject(ArticlesApiClientProvider).getClient();
  private readonly _transferState = inject(TransferState);
  private readonly _platformId = inject(PLATFORM_ID);

  // --- Feature State (Signal) ---
  private readonly _state = signal<MostViewedArticlesListState>(initialMostViewedArticlesListState);

  // --- Selectors (Computed) ---
  readonly mostViewedArticle = computed(() => this._state().article);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly errorMessage = computed(() => this._state().errorMessage);
  readonly status = computed(() => this._state().status);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // const cachedState = this._transferState.get<MostViewedArticlesListState>(
      //   MOST_VIEWED_ARTICLES_STATE_KEY,
      //   initialMostViewedArticlesListState
      // );
      // if (cachedState) {
      //   Logger.debug('Hydrating most viewed articles from TransferState', cachedState);
      //   this._updateState(cachedState);
      //   this._transferState.remove(MOST_VIEWED_ARTICLES_STATE_KEY);
      // }
    }
  }

  // --- Public Methods ---
  fetchMostViewedArticles(): void {
    Logger.debug('Fetching most viewed articles...');

    this._updateState({ isLoading: true, errorMessage: null, status: false });

    // const cached = this._transferState.get<MostViewedArticlesListState>(
    //   MOST_VIEWED_ARTICLES_STATE_KEY,
    //   null as any
    // );

    // if (isPlatformBrowser(this._platformId) && cached?.article) {
    //   Logger.debug('Using cached most viewed articles from TransferState');
    //   this._updateState({
    //     article: cached.article,
    //     status: cached.status,
    //     isLoading: false,
    //     errorMessage: null,
    //   });
    //   this._transferState.remove(MOST_VIEWED_ARTICLES_STATE_KEY);
    //   return;
    // }

    // Call the specific API endpoint for most viewed articles
    this._apiClient
      .MostViewedArticles() // This method needs to be added to ICollectionApiClient
      .pipe(
        tap((response: IMostViewedArticlesResponseDto) => {
          if (response?.data) {
            this._updateState({
              article: response.data,
              status: response.status,
              errorMessage: null,
            });
          } else {
            this._updateState({
              article: null,
              status: response.status, // Still success, but no data
              errorMessage: '📭 No most viewed articles found.',
            });
          }

          if (!isPlatformBrowser(this._platformId)) {
            this._transferState.set(MOST_VIEWED_ARTICLES_STATE_KEY, this._state());
            Logger.debug('Stored most viewed articles in TransferState for SSR');
          }
        }),
        catchError((error: ApiError) => {
          this._updateState({
            article: null,
            status: false,
            errorMessage: '🚨 Error loading most viewed articles. Please try again later.',
          });
          handleApiErrors(error);
          return EMPTY;
        }),
        finalize(() => this._updateState({ isLoading: false }))
      )
      .subscribe();
  }

  // --- Private Utility Method ---
  private _updateState(updates: Partial<MostViewedArticlesListState>): void {
    this._state.update(state => ({ ...state, ...updates }));
  }
  updateMostViewedArticleBookmark(articleId: number, isBookmarked: boolean): void {
    this._state.update(state => {
      const article = state.article;

      if (!article || article.id !== articleId) return state;

      return {
        ...state,
        article: {
          ...article,
          is_bookmark: isBookmarked,
        },
      };
    });
  }

}
