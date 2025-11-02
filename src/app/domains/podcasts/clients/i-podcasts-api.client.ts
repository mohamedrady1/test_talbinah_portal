import { IPaginationParameters } from '../../../common';
import { IFavoritePodcastsListingResponseDto, IPodcastCategoriesListingResponseDto, IPodcastsListingResponseDto, IRandomPodcastsListingResponseDto, IRecommendedPodcastsListingResponseDto, ITogglePodcastFavoriteResponseDto } from '../dtos';
import { IPodcastResponseDto } from '../dtos/responses/podcast-response.dto';
import { IPodcast } from '../models';
import { Observable } from 'rxjs';

export interface IPodcastsApiClient {
  // get: ( paginationParameters?: IPaginationParameters) => Observable<IPaginationResponse<IArticlesListingResponseDto>>;
  getAll: (paginationParameters?: IPaginationParameters) => Observable<IPodcastsListingResponseDto>;

  getFavorites: (paginationParameters?: IPaginationParameters) => Observable<IFavoritePodcastsListingResponseDto>;
  getRandom: (paginationParameters?: IPaginationParameters) => Observable<IRandomPodcastsListingResponseDto>;
  getRecommended: (paginationParameters?: IPaginationParameters) => Observable<IRecommendedPodcastsListingResponseDto>;

  getById: (id: string) => Observable<IPodcastResponseDto>;

  toggleFavorite: (id: string | number) => Observable<ITogglePodcastFavoriteResponseDto>;
  // update: (id: string, request: IUpsertCustomerRequest) => Observable<void>;

  getCategories(): Observable<IPodcastCategoriesListingResponseDto>;
}
