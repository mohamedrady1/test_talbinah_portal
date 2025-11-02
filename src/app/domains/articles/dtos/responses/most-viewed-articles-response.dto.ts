import { IArticle } from "./articles-listing-response.dto";

export interface IMostViewedArticlesResponseDto {
  status: boolean;
  message: string | null;
  data: IArticle;
}
