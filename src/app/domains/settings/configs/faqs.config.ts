import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

// Search Config
export const FaqsSearchConfig: InputSearchConfig = {
    placeholder: 'search_faq_placeholder',
    debounceMs: 300,
    persistKey: 'faqs-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
};

// Error State Config Factory
export const getFaqsErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'faq_loading_error',
    onRetry,
    imgWidth: '38%'
});

// Empty State Config
export const FaqsEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'no_faqs_available',
    imgWidth: '38%'
}; 