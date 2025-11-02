import { FaqItem } from '../dtos/responses/faqs-response.dto';

export interface FaqsFeatureState {
    isLoading: boolean;
    errorMessage: string | null;
    faqs: FaqItem[];
    faqsResponse: any | null;
}

export interface FaqsListState {
    items: FaqItem[];
    selectedFaqId: number | null;
}

export const initialFaqsFeatureState: FaqsFeatureState = {
    isLoading: false,
    errorMessage: null,
    faqs: [],
    faqsResponse: null,
};

export const initialFaqsListState: FaqsListState = {
    items: [],
    selectedFaqId: null,
}; 