import { IPodcast } from "../../models";

export interface IRandomPodcastsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPodcast[];
}
