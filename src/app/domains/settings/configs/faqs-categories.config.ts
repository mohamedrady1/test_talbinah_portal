import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

// Search Config
export const FaqsCategoriesSearchConfig: InputSearchConfig = {
    placeholder: 'settings.settingFaqs.searchPlaceholder',
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
    title: 'settings.settingFaqs.errorTitle',
    onRetry,
    imgWidth: '25%'
});

// Empty State Config
export const FaqsCategoriesEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'settings.settingFaqs.emptyTitle',
    message: 'settings.settingFaqs.emptyMessage',
    imgWidth: '25%'
}; 