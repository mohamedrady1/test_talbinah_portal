import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IQuickAccessCardsRequestDto,
  IQuickAccessCardsResponseDto,
  IPodcastStoriesRequestDto,
  IPodcastStoriesResponseDto,
  IHomeContentResponseDto,
  IBannerClickRequestDto,
  IBannerClickResponseDto
} from '../dtos';
import { IMainPageApiClient } from './i-main-page-api.client';
import { mockHomeData } from '../data';

@Injectable({ providedIn: 'root' })
export class MainPageInMemoryApiClient implements IMainPageApiClient {
  getQuickAccessCards(_: IQuickAccessCardsRequestDto): Observable<IQuickAccessCardsResponseDto> {
    return of({ cards: mockHomeData.quickAccessCards || [] });
  }

  getPodcastStories(_: IPodcastStoriesRequestDto): Observable<IPodcastStoriesResponseDto> {
    return of({
      stories: mockHomeData.podcastStories || [],
      total: (mockHomeData.podcastStories || []).length
    });
  }

  getHomeContent(): Observable<IHomeContentResponseDto> {
    return of({
      status: true,
      message: null,
      data: mockHomeData
    }); // ← New combined method with wrapper
  }

  sendBannerClick(payload: IBannerClickRequestDto): Observable<IBannerClickResponseDto> {
    return of({
      status: true,
      message: null,
      data: {
        id: payload.banner_id,
        click_count: 1,
        original_active: null,
        users_clicked: 1
      }
    });
  }
}
