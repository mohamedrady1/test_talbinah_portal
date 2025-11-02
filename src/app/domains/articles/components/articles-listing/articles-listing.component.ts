import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
import { CompeleteDataAndRegisterNowComponent, GlobalSearchInputComponent, ICardHeaderConfig, InputSearchConfig, ModalService, PageLayoutCardHeaderComponent, PaginationConfig, PaginationListingComponent, StorageKeys } from '../../../../shared';
import { CardType, Logger, StorageService } from '../../../../common';
import { ArticlesCardSideHeader, ArticlesRoutesEnum, MostFavoriteArticlesSideHeader, MostReadArticlesSideHeader } from '../../constants';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, PLATFORM_ID, computed, signal, effect } from '@angular/core';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { IArticle } from '../../dtos';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ArticlesFacade, FavoriteArticlesFacade, MostViewedArticlesFacade } from '../../services';
import { ArticleCardShimmerComponent } from '../article-card-shimmer';
import { ErrorStateComponent } from "../../../../shared/components/error-state/error-state.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { ArticlesEmptyState, getArticlesError, getMostViewedArticleError, getmyFavouriteArticlesError } from '../../configs';
import { ArticlesFavouriteListComponent } from '../articles-favourite-list';
import { getFavoritePodcastsError } from '../../../podcasts';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { getError } from '../../../therapeutic-programs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles-listing',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutCardHeaderComponent,
    ArticleCardComponent,
    PaginationListingComponent,
    GlobalSearchInputComponent,
    TranslateModule,
    ArticleCardShimmerComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    CompeleteDataAndRegisterNowComponent,

    TranslateApiPipe
  ],
  templateUrl: './articles-listing.component.html',
  styleUrls: ['./articles-listing.component.scss'],
  // Consider OnPush strategy for performance, especially with signals
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesListingComponent {
  // ✅ Inject API Clients and dependencies
  private cdr = inject(ChangeDetectorRef); // Still useful for manual change detection if needed
  private platformId = inject(PLATFORM_ID);
  private articlesFacade = inject(ArticlesFacade);
  private favoriteArticlesFacade = inject(FavoriteArticlesFacade);
  private mostViewedArticlesFacade = inject(MostViewedArticlesFacade);
  private modalService = inject(ModalService);

  // Expose state properties as computed signals from the facades
  // These are already signals, so they handle reactivity and SSR well.
  readonly articlesResponse = this.articlesFacade.articlesResponse;
  readonly isLoading = this.articlesFacade.isLoading;
  readonly isLoadingFilter = this.articlesFacade.isFiltering;
  readonly errorMessage = this.articlesFacade.errorMessage;
  readonly totalItems = this.articlesFacade.totalItems;

  readonly favoriteArticles = this.favoriteArticlesFacade.favoriteArticles;
  readonly isLoadingFavorites = this.favoriteArticlesFacade.isLoading;
  readonly statusFavorites = this.favoriteArticlesFacade.status;
  readonly favoriteArticlesErrorMessage = this.favoriteArticlesFacade.errorMessage;

  readonly mostViewedArticle = this.mostViewedArticlesFacade.mostViewedArticle;
  readonly isLoadingMostViewed = this.mostViewedArticlesFacade.isLoading;
  readonly statusMostViewed = this.mostViewedArticlesFacade.status;
  readonly mostViewedArticlesErrorMessage = this.mostViewedArticlesFacade.errorMessage;

  // Configuration constants
  readonly headerConfig: ICardHeaderConfig = ArticlesCardSideHeader;
  readonly mostReadHeaderConfig: ICardHeaderConfig = MostReadArticlesSideHeader;
  readonly mostFavoriteHeaderConfig: ICardHeaderConfig = MostFavoriteArticlesSideHeader;
  readonly cardTypes = CardType;

  // Pagination configuration
  readonly currentPage = this.articlesFacade.currentPage;
  readonly totalPages = this.articlesFacade.totalPages;

  // Search configuration
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly searchSuggestions = this.articlesFacade.searchSuggestions;

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);
  private readonly _Router = inject(Router);
  // ----- Auth / Guest Signals -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  // ----- Computed Signals -----
  public readonly isLoggedIn = computed(() => !!this.token());

  readonly searchConfig = computed<InputSearchConfig>(() => ({
    formControl: this.searchControl,
    placeholder: 'search2',
    suggestions: this.searchSuggestions(), // `suggestions()` will be `null` or `undefined` initially if not fetched, but `GlobalSearchInputComponent` should handle it.
    debounceMs: 500,
    persistKey: 'article-search-topic',
    autoFocus: false,
    emitWhenClick: false
  }));
  protected articlesLoaded = signal(false);

  // Pagination config signal for reactive updates
  readonly paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  }));
  constructor() {
    // Reactively track All Programs
    effect(() => {
      const articles = this.articlesFacade.articlesResponse();
      if (articles) {
        this.articlesLoaded.set(true);
        this.articlesErrorState.set(
          getError(() => this.articlesFacade.fetchArticles(this.articlesFacade.currentPage()))
        );
      }
    });

    // Reactively track My Programs
    effect(() => {
      const articles = this.articlesFacade.articlesResponse();
      if (articles) {
        this.articlesLoaded.set(true);

        this.favouriteArticlesErrorState.set(
          getError(() => this.articlesFacade.fetchArticles(this.articlesFacade.currentPage()))
        );
      }
    });
    effect(() => {
      const articles = this.articlesFacade.articlesResponse();
      if (articles) {
        this.articlesLoaded.set(true);
        this.MostViewedArticlesErrorState.set(
          getError(() => this.articlesFacade.fetchArticles(this.articlesFacade.currentPage()))
        );
      }
    });
    this.articlesErrorState.set(getArticlesError(() => this.articlesFacade.fetchArticles()));
    this.MostViewedArticlesErrorState.set(getMostViewedArticleError(() => this.mostViewedArticlesFacade.fetchMostViewedArticles()));
    this.favouriteArticlesErrorState.set(getmyFavouriteArticlesError(() => this.favoriteArticlesFacade.fetchFavoriteArticles()));
  }
  ngOnInit(): void {
    this.setUpFetchDataAfterLogin();

  }
  articlesEmptyState = ArticlesEmptyState;
  protected allProgramsErrorState = signal<any | null>(null);
  protected myProgramsErrorState = signal<any | null>(null);
  protected readonly articlesErrorState = signal<any | null>(null);
  protected readonly MostViewedArticlesErrorState = signal<any | null>(null);
  protected readonly favouriteArticlesErrorState = signal<any | null>(null);

  // Event handlers for paginated articles (delegated to ArticlesFacade)
  private handlePageChange(page: number): void {
    // Guard client-side actions if necessary (though this should be fine)
    if (this.isBrowser()) {
      Logger.debug('Page changed to:', page);
      this.articlesFacade.fetchArticles(page, true);
    }
  }

  protected handleSearch(value: string): void {
    if (this.isBrowser()) {
      Logger.debug('Search term entered:', value);
      this.articlesFacade.resetPaginationAndSearchState();
      this.articlesFacade.fetchArticles(1, true, value);
    }
  }

  protected handleClearSearch(): void {
    if (this.isBrowser()) {
      Logger.debug('Search cleared');
      this.searchControl.setValue('');
      this.articlesFacade.resetPaginationAndSearchState();
      this.articlesFacade.fetchArticles(1, true);
    }
  }

  // General event handler (can be extended or delegated to respective facades)
  protected handleFavouriteToggle(item: IArticle): void {
    if (this.isBrowser()) { // Ensure this only runs on the client
      Logger.debug('Article favourite toggled:', item);
      const updatedBookmark = !item.is_bookmark;

      // Update facades
      this.articlesFacade.updateArticleBookmark(item.id, updatedBookmark);
      this.mostViewedArticlesFacade.updateMostViewedArticleBookmark(item.id, updatedBookmark);
      this.favoriteArticlesFacade.updateFavoriteArticleBookmark(item.id, updatedBookmark);

      // Re-fetch favorites to reflect the change
      this.favoriteArticlesFacade.fetchFavoriteArticles();
    }
  }

  // SSR check for client-side only logic
  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  protected openArticlePopup(): void {
    // This function likely involves client-side DOM manipulation or modal services.
    // Ensure the service/logic it calls is also SSR-safe or guarded by isBrowser().
    if (this.isBrowser()) {
      // Implement popup opening logic here
    }
  }
  private readonly _UserContextService = inject(UserContextService);


  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }
  private setUpFetchDataAfterLogin(): void {
    this._UserContextService.recallUserDataViewed
      .subscribe((emitted: boolean) => {
        const currentUrl = this._Router.url;
        Logger.debug('ArticlesListingComponent | currentUrl:', currentUrl);

        if (currentUrl.startsWith('/' + ArticlesRoutesEnum.ARTICLES_MAIN_PAGE) && this.isBrowser()) {
          this.refreshLoginStatus();

          // Only fetch if not already loading to prevent duplicate calls
          if (this.isLoggedIn()) {
            if (!this.favoriteArticlesFacade.isLoading()) {
              this.favoriteArticlesFacade.fetchFavoriteArticles();
            }
            if (!this.mostViewedArticlesFacade.isLoading()) {
              this.mostViewedArticlesFacade.fetchMostViewedArticles();
            }
            if (!this.articlesFacade.isLoading()) {
              this.articlesFacade.fetchArticles();
            }
          } else {
            this.favoriteArticlesFacade.resetFavoriteArticles();
            if (!this.mostViewedArticlesFacade.isLoading()) {
              this.mostViewedArticlesFacade.fetchMostViewedArticles();
            }
            if (!this.articlesFacade.isLoading()) {
              this.articlesFacade.fetchArticles();
            }
          }
        }
      });
  }
  protected openFavouriteArticlesPopup(): void {
    this.modalService.open(ArticlesFavouriteListComponent, {
      inputs: {
        image: 'images/home/icons/articles.png',
        title: this.mostFavoriteHeaderConfig.title,
      }, width: '50%',
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      }
    })
  }
}
