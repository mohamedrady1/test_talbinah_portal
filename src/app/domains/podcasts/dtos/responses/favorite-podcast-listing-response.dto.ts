import { IGlobalPodcastItemModel } from "../../../../common";
import { IPodcast } from "../../models";

export interface IFavoritePodcastsListingResponseDto {
  status: boolean;
  message: string | null;
  data: IPodcast[] | IGlobalPodcastItemModel[] | any;
}
