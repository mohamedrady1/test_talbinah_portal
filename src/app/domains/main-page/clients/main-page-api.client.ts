import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IQuickAccessCardsRequestDto,
  IQuickAccessCardsResponseDto,
  IPodcastStoriesRequestDto,
  IPodcastStoriesResponseDto,
  IHomeContentResponseDto,
  IBannerClickRequestDto,
  IBannerClickResponseDto
} from '../dtos';
import { MainPageManagementCollections } from '../collections';
import { IMainPageApiClient } from './i-main-page-api.client';
import { CollectionApiClient } from '../../../common';

@Injectable({ providedIn: 'root' })
export class MainPageApiClient implements IMainPageApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      MainPageManagementCollections.Home,
      this.http
    );
  }

  getQuickAccessCards(): Observable<IQuickAccessCardsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MainPageManagementCollections.QuickAccessCards()
    });
  }

  getPodcastStories(): Observable<IPodcastStoriesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MainPageManagementCollections.PodcastStories()
    });
  }


  queryParams = { page: 2, size: 10, sort: 'desc' };
  body = { name: 'Podcast 1' };
  id = 'abc123';

  getHomeContent(params?: any): Observable<IHomeContentResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MainPageManagementCollections.homeContent(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  sendBannerClick(payload: IBannerClickRequestDto): Observable<IBannerClickResponseDto> {
    return this.collectionApiClient.post({
      collectionName: MainPageManagementCollections.BannerClick(),
      body: payload,
      requestOptions: {
        params: {
          banner_id: payload.banner_id
        }
      }
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
