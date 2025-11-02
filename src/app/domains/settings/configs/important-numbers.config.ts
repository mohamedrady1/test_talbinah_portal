import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

export const getImportantNumbersErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'settings.importantNumbers.errorTitle',
    onRetry,
    imgWidth: '25%'
});

export const ImportantNumbersEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'settings.importantNumbers.emptyTitle',
    imgWidth: '25%'
};

export const ImportantNumbersSearchConfig: InputSearchConfig = {
    placeholder: 'settings.importantNumbers.searchPlaceholder',
    debounceMs: 300,
    persistKey: 'important-numbers-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
}; 