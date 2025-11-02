import { IArticle } from "./articles-listing-response.dto";

export interface IFavoritesArticlesListingResponseDto {
  status: boolean;
  message: string | null;
  data: {
    data: IArticle[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
}
