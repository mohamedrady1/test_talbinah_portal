// favorite-articles.models.ts

import { IArticle } from "../dtos";

export interface FavoriteArticlesListState {
  articles: IArticle[];
  isLoading: boolean;
  errorMessage: string | null;
  status: boolean | null;
  currentPage: number;
  totalItems: number;  // Add this
  totalPages: number;  // Add this
}

export const initialFavoriteArticlesListState: FavoriteArticlesListState = {
  articles: [],
  isLoading: false,
  errorMessage: null,
  status: null,
  currentPage: 1,    // Initialize
  totalItems: 0,     // Initialize
  totalPages: 1,     // Initialize
};