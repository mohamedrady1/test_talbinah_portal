import { IPaginationParameters, IPaginationResponse } from '../../../common';
import { IArticleResponseDto, IArticlesListingResponseDto, IFavoritesArticlesListingResponseDto, IMostViewedArticlesResponseDto, IToggleFavoriteArticle, IToggleFavoriteArticleResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface IArticlesApiClient {
  // get: ( paginationParameters?: IPaginationParameters) => Observable<IPaginationResponse<IArticlesListingResponseDto>>;
  getAll: (paginationParameters?: IPaginationParameters) => Observable<IArticlesListingResponseDto>;
  FavoriteArticles: (paginationParameters?: IPaginationParameters) => Observable<IFavoritesArticlesListingResponseDto>;
  MostViewedArticles: () => Observable<IMostViewedArticlesResponseDto>;
  ToggleFavoriteArticle: (payload: IToggleFavoriteArticle) => Observable<IToggleFavoriteArticleResponseDto>;

  getById: (id: string) => Observable<IArticleResponseDto>;
}
