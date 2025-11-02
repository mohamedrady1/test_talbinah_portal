import { ErrorStateConfig, EmptyStateConfig } from '../../../shared';
import { InputSearchConfig } from '../../../shared/components/global-search-input';

export const getWalletErrorConfig = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'settings.wallet.walletCard.errorTitle',
    onRetry,
    imgWidth: '25%'
});

export const WalletEmptyConfig: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image 230.svg',
    title: 'settings.wallet.walletCard.emptyTitle',
    imgWidth: '25%'
};

export const WalletSearchConfig: InputSearchConfig = {
    placeholder: 'settings.wallet.walletCard.searchPlaceholder',
    debounceMs: 300,
    persistKey: 'wallet-search',
    suggestions: [],
    autoFocus: false,
    disabled: false,
    keyboardNavigation: true,
    remoteSuggestions: false,
    emitWhenClick: false
}; 