import { IPodcast } from "../../models";
export interface ITogglePodcastFavoriteResponseDto {
  status: boolean;
  message: string | null;
  data: IPodcast | null;
}
