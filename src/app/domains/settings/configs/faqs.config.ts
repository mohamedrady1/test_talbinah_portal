import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

// Search Config
export const FaqsSearchConfig: InputSearchConfig = {
    placeholder: 'settings.settingFaqs.searchFaqsPlaceholder',
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
    title: 'settings.settingFaqs.errorTitle',
    onRetry,
    imgWidth: '38%'
});

// Empty State Config
export const FaqsEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-13.svg',
    title: 'settings.settingFaqs.emptyFaqsTitle',
    message: 'settings.settingFaqs.emptyFaqsMessage',
    imgWidth: '38%'
}; 