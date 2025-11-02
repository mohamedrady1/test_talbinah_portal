import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

// Search Config
export const FaqsCategoriesSearchConfig: InputSearchConfig = {
    placeholder: 'search_faq_placeholder',
    debounceMs: 300,
    persistKey: 'faqs-categories-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
};

// Error State Config Factory
export const getFaqsCategoriesErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'faq_loading_error',
    onRetry,
    imgWidth: '25%'
});

// Empty State Config
export const FaqsCategoriesEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'no_faqs_available',
    message: 'no_faqs_available_detailed',
    imgWidth: '25%'
}; 