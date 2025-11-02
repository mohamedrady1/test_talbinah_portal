// articles/models/favorite-articles.models.ts
import { IArticle } from '../dtos'; // Assuming IArticle is defined in your dtos

export interface MostViewedArticlesListState {
  article: IArticle | null;
  isLoading: boolean;
  status: boolean;
  errorMessage: string | null;
}

export const initialMostViewedArticlesListState: MostViewedArticlesListState = {
  article: null,
  isLoading: false,
  status: false,
  errorMessage: null,
};
