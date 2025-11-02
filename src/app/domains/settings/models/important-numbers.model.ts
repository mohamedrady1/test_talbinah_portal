import { ImportantNumberItem } from '../dtos/responses/important-numbers-response.dto';

export interface ImportantNumbersFeatureState {
    isLoading: boolean;
    errorMessage: string | null;
    importantNumbers: ImportantNumberItem[];
    importantNumbersResponse: any;
}

export interface ImportantNumbersListState {
    importantNumbers: ImportantNumberItem[];
    filteredImportantNumbers: ImportantNumberItem[];
    searchTerm: string;
}

export const initialImportantNumbersFeatureState: ImportantNumbersFeatureState = {
    isLoading: false,
    errorMessage: null,
    importantNumbers: [],
    importantNumbersResponse: null
};

export const initialImportantNumbersListState: ImportantNumbersListState = {
    importantNumbers: [],
    filteredImportantNumbers: [],
    searchTerm: ''
}; 