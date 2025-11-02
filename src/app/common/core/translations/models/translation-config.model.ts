/**
 * Translation Configuration Models
 */

/**
 * Configuration for translation caching
 */
export interface ITranslationCacheConfig {
    /**
     * Cache duration in milliseconds
     * Default: 24 hours (86400000 ms)
     */
    cacheDuration?: number;

    /**
     * Whether to use TransferState for SSR
     * Default: true
     */
    useTransferState?: boolean;

    /**
     * Whether to use localStorage for caching
     * Default: true
     */
    useLocalStorage?: boolean;

    /**
     * Whether to use mock data instead of real API
     * Useful for development and testing
     * Default: false
     */
    useMock?: boolean;
}

/**
 * Default cache configuration
 */
export const DEFAULT_TRANSLATION_CACHE_CONFIG: ITranslationCacheConfig = {
    cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
    useTransferState: true,
    useLocalStorage: true,
    useMock: false,
};

/**
 * TransferState and Storage Keys
 * Separate keys for each language
 */
export const TRANSLATION_KEYS = {
    TRANSFER_STATE_AR: 'app-translations-ar',
    TRANSFER_STATE_EN: 'app-translations-en',
    STORAGE_AR: 'talbinah-translations-ar',
    STORAGE_EN: 'talbinah-translations-en',
} as const;


