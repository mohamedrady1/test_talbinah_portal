import { WalletData } from '../dtos/responses/wallet-response.dto';

export interface WalletFeatureState {
    isLoading: boolean;
    errorMessage: string | null;
    walletData: WalletData | null;
    walletResponse: any;
}

export interface WalletListState {
    walletData: WalletData | null;
    searchTerm: string;
}

export const initialWalletFeatureState: WalletFeatureState = {
    isLoading: false,
    errorMessage: null,
    walletData: null,
    walletResponse: null
};

export const initialWalletListState: WalletListState = {
    walletData: null,
    searchTerm: ''
}; 