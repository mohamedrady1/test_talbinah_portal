export class ArticlesManagementCollections {
  static ModuleName: string = 'api';

  static Articles: string = `${ArticlesManagementCollections.ModuleName}`;

  static ArticlesListing(): string {
    return `${ArticlesManagementCollections.Articles}/articles`;
  }
  static FavoriteArticles(): string {
    return `${ArticlesManagementCollections.Articles}/bookmarks`;
  }
  static MostViewedArticles(): string {
    return `${ArticlesManagementCollections.Articles}/articles/most-viewed`;
  }
  static ToggleFavoriteArticle(): string {
    return `${ArticlesManagementCollections.Articles}/toggle-bookmark`;
  }

  static GetArticleById(id: string): string {
    return `${ArticlesManagementCollections.Articles}/${id}`;
  }
  // api/bookmarks => get
}
