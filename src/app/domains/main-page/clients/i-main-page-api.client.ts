import { IHomeContentRequestDto, IHomeContentResponseDto, IPodcastStoriesRequestDto, IPodcastStoriesResponseDto, IQuickAccessCardsRequestDto, IQuickAccessCardsResponseDto, IBannerClickRequestDto, IBannerClickResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface IMainPageApiClient {
  getQuickAccessCards(payload?: IQuickAccessCardsRequestDto): Observable<IQuickAccessCardsResponseDto>;
  getPodcastStories(payload?: IPodcastStoriesRequestDto): Observable<IPodcastStoriesResponseDto>;
  getHomeContent: (payload?: IHomeContentRequestDto) => Observable<IHomeContentResponseDto>;
  sendBannerClick: (payload: IBannerClickRequestDto) => Observable<IBannerClickResponseDto>;
}
