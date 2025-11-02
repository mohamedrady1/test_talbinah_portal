import { IPodcast } from "../../models";

export interface IRecommendedPodcastsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPodcast[];
}
