import { ISettingsResponseDto } from '../dtos';

export interface ArticlesListState {
  response: ISettingsResponseDto | null;
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  searchSuggestions: string[]; // Added for search suggestions
}

export interface ArticlesFeatureState {
  articles: ArticlesListState;
  // You can add other feature-related states here if needed
}

export const initialArticlesListState: ArticlesListState = {
  response: null,
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  searchSuggestions: [],
};

export const initialArticlesFeatureState: ArticlesFeatureState = {
  articles: initialArticlesListState,
};
