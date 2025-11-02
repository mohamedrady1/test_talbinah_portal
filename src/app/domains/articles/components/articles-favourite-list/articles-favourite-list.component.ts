import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ArticlesFacade, FavoriteArticlesFacade, MostViewedArticlesFacade } from '../../services';
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { ErrorStateComponent } from "../../../../shared/components/error-state/error-state.component";
import { ArticlesEmptyState } from '../../configs';
import { ArticleCardComponent } from "../article-card/article-card.component";
import { isPlatformBrowser } from '@angular/common';
import { CardType, defaultPaginationParameters, IPaginationParameters, Logger } from '../../../../common';
import { IArticle } from '../../dtos';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { PaginationConfig, PaginationListingComponent } from '../../../../shared';
import { getFavoritePodcastsError, PodcastSkeletonComponent } from '../../../podcasts';

@Component({
  selector: 'app-articles-favourite-list',
  standalone: true,
  imports: [PodcastSkeletonComponent, EmptyStateComponent, ErrorStateComponent, ArticleCardComponent, AutoExactHeightDirective, PaginationListingComponent],
  templateUrl: './articles-favourite-list.component.html',
  styleUrls: ['./articles-favourite-list.component.scss']
})
export class ArticlesFavouriteListComponent {
  private favoriteArticlesFacade = inject(FavoriteArticlesFacade);
  private readonly platformId = inject(PLATFORM_ID);
  cardTypes = CardType;

  // SSR check for client-side only logic
  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  readonly favoriteArticles = this.favoriteArticlesFacade.favoriteArticles;
  readonly isLoadingFavorites = this.favoriteArticlesFacade.isLoading;
  readonly statusFavorites = this.favoriteArticlesFacade.status;
  readonly favoriteArticlesErrorMessage = this.favoriteArticlesFacade.errorMessage;
  private articlesFacade = inject(ArticlesFacade);
  private mostViewedArticlesFacade = inject(MostViewedArticlesFacade);

  articlesEmptyState = ArticlesEmptyState;

  protected readonly favouriteArticlesErrorState = getFavoritePodcastsError(() => this.favoriteArticlesFacade.fetchFavoriteArticles());

  // Pagination configuration
  // readonly isLoadingFilter = computed(() => this.favouriteArticlesErrorState().isLoadingFilter);
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 3, total: 1 };
  readonly currentPage = signal<number>(1);
  readonly totalPages = this.favoriteArticlesFacade.totalPages;

  // Pagination config signal for reactive updates
  readonly paginationConfig = signal<PaginationConfig>({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  });

  ngOnInit() {
    this.favoriteArticlesFacade.fetchFavoriteArticles(
      this._paginationParams.page ?? 1,
    );
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

  // Event handlers for paginated articles (delegated to ArticlesFacade)
  private handlePageChange(page: number): void {
    // Guard client-side actions if necessary (though this should be fine)
    this.currentPage.set(page);
    this.paginationConfig().currentPage = page;
    this._paginationParams.page = page;

    if (this.isBrowser()) {
      Logger.debug('Page changed to:', page);
      this.favoriteArticlesFacade.fetchFavoriteArticles(page, false);

    }
  }

}
