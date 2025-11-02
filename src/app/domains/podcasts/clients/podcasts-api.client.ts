import { PodcastsManagementCollections } from "../collections";
import { IPodcastsApiClient } from "./i-podcasts-api.client";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IFavoritePodcastsListingResponseDto, IPodcastCategoriesListingResponseDto, IPodcastsListingResponseDto, IRandomPodcastsListingResponseDto, IRecommendedPodcastsListingResponseDto, ITogglePodcastFavoriteResponseDto } from "../dtos";
import { IPodcastResponseDto } from "../dtos/responses/podcast-response.dto";

@Injectable({ providedIn: 'root' })
export class PodcastsApiClient implements IPodcastsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      PodcastsManagementCollections.Podcasts,
      this.http
    );
  }

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<IPodcastsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.AllPodcastsListing(),
      paginationParameters
    });
  }

  getFavorites(paginationParameters?: IPaginationParameters): Observable<IFavoritePodcastsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.FavoritePodcasts(),
      paginationParameters
    });
  }

  getRandom(paginationParameters?: IPaginationParameters): Observable<IRandomPodcastsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.RandomPodcasts(),
      paginationParameters
    });
  }

  getRecommended(paginationParameters?: IPaginationParameters): Observable<IRecommendedPodcastsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.RecommendedPodcasts(),
      paginationParameters
    });
  }

  getById(id: string): Observable<IPodcastResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.AllPodcastsListing(),
      id
    });
  }

  toggleFavorite(id: string | number): Observable<ITogglePodcastFavoriteResponseDto> {
    return this.collectionApiClient.post({
      collectionName: PodcastsManagementCollections.toggleFavorite(),
      requestOptions: {
        params: {
          podcast_id: id
        }
      }
    });
  }

  getCategories(): Observable<IPodcastCategoriesListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PodcastsManagementCollections.PodcastCategories()
    });
  }
}

// GET (with paginationParameters)
// this.collectionApiClient.get({
//   collectionName: 'podcasts',
//   paginationParameters: queryParams
// });

// POST (with query params + body)

// this.collectionApiClient.post({
//   collectionName: 'podcasts',
//   body,
//   paginationParameters: queryParams
// });

// PUT
// this.collectionApiClient.put({
//   collectionName: 'podcasts',
//   id,
//   body,
//   paginationParameters: queryParams
// });

// DELETE
// this.collectionApiClient.delete({
//   collectionName: 'podcasts',
//   id,
//   paginationParameters: queryParams
// });
