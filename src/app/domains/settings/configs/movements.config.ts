import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

export const getMovementsErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'transactions_loading_error',
    onRetry,
    imgWidth: '25%'
});

export const MovementsEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'no_transactions_available',
    imgWidth: '25%'
};


export const MovementsSearchConfig: InputSearchConfig = {
    placeholder: 'settings.movements.searchPlaceholder',
    debounceMs: 300,
    persistKey: 'movements-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
}; 