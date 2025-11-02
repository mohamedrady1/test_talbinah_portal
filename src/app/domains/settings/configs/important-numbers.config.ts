import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

export const getImportantNumbersErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'important_numbers_loading_error',
    onRetry,
    imgWidth: '25%'
});

export const ImportantNumbersEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'no_important_numbers_available',
    imgWidth: '25%'
};

export const ImportantNumbersSearchConfig: InputSearchConfig = {
    placeholder: 'search_important_numbers_placeholder',
    debounceMs: 300,
    persistKey: 'important-numbers-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
}; 