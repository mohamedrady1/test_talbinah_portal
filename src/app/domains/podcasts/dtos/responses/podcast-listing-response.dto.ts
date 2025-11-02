import { IPodcast } from "../../models";

export interface IPodcastsListingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    podcasts: IPodcast[] | [] | null;
    most_visit: any | null;
  };
}
