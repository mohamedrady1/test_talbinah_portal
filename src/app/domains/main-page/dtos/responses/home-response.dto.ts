import { IPodcastStory } from "./get-podcast-stories-response.dto";
import { IQuickAccessCard } from "./get-quick-access-cards-response.dto";
import { IBannerItem } from "./banner-response.dto";

export interface IHomeContentData {
  quickAccessCards?: IQuickAccessCard[];
  podcastStories?: IPodcastStory[];
  banners?: IBannerItem[];
}

export interface IHomeContentResponseDto {
  status: boolean;
  message: string | null;
  data: IHomeContentData;
}
