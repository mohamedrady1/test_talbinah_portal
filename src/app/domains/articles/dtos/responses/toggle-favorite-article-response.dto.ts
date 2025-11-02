import { IArticle } from "./articles-listing-response.dto";

export interface IToggleFavoriteArticleResponseDto {
  status: boolean;
  message: string | null;
  data: IArticle | null;
}
