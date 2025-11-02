import { IFaqsCategoriesResponseDto, IFaqsCategoryDto } from '../dtos';

export interface FaqsCategoriesListState {
    response: IFaqsCategoriesResponseDto | null;
    isLoading: boolean;
    isFiltering: boolean;
    errorMessage: string | null;
    categories: IFaqsCategoryDto[];
}

export interface FaqsCategoriesFeatureState {
    categories: FaqsCategoriesListState;
}

export const initialFaqsCategoriesListState: FaqsCategoriesListState = {
    response: null,
    isLoading: false,
    isFiltering: false,
    errorMessage: null,
    categories: [],
};

export const initialFaqsCategoriesFeatureState: FaqsCategoriesFeatureState = {
    categories: initialFaqsCategoriesListState,
}; 