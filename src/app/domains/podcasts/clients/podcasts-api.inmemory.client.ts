import { IPodcastsApiClient } from './i-podcasts-api.client';
import { IFavoritePodcastsListingResponseDto, IPodcastCategoriesListingResponseDto, IPodcastsListingResponseDto, IRandomPodcastsListingResponseDto, IRecommendedPodcastsListingResponseDto, ITogglePodcastFavoriteResponseDto } from '../dtos';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockFavoritePodcastsListingResponse, mockPodcastCategoriesResponse, mockPodcastFavoriteToggleResponse, mockPodcastsListingResponse, mockRandomPodcastsListingResponse, mockRecommendedPodcastsListingResponse } from '../data';
import { IPaginationParameters } from '../../../common';
import { IPodcastResponseDto } from '../dtos/responses/podcast-response.dto';

@Injectable({ providedIn: 'root' })
export class PodcastsInMemoryApiClient implements IPodcastsApiClient {
  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<IPodcastsListingResponseDto> {
    return of(mockPodcastsListingResponse); // ← New combined method
  }

  getFavorites(paginationParameters?: IPaginationParameters): Observable<IFavoritePodcastsListingResponseDto> {
    return of(mockFavoritePodcastsListingResponse); // ← New combined method
  }

  getRandom(paginationParameters?: IPaginationParameters): Observable<IRandomPodcastsListingResponseDto> {
    return of(mockRandomPodcastsListingResponse); // ← New combined method
  }

  getRecommended(paginationParameters?: IPaginationParameters): Observable<IRecommendedPodcastsListingResponseDto> {
    return of(mockRecommendedPodcastsListingResponse); // ← New combined method
  }

  getById(id: string): Observable<IPodcastResponseDto> {
    return of(); // ← New combined method
  }

  toggleFavorite(id: string | number): Observable<ITogglePodcastFavoriteResponseDto> {
    return of(mockPodcastFavoriteToggleResponse);
  }

  getCategories(): Observable<IPodcastCategoriesListingResponseDto> {
    return of(mockPodcastCategoriesResponse);
  }
}
