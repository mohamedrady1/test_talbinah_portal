/**
 * Translation API Response DTOs
 * Defines the structure of translation data from the API
 */

/**
 * Response structure for translations API
 * The API returns translations for a single language per request
 */
export interface ITranslationsApiResponse {
    status: boolean;
    message: string | null;
    data: ILanguageTranslations;
}

/**
 * Individual language translations
 * Key-value pairs for translation keys and values
 */
export interface ILanguageTranslations {
    [key: string]: string | INestedTranslation;
}

/**
 * Support for nested translations
 */
export interface INestedTranslation {
    [key: string]: string | INestedTranslation;
}

/**
 * Cached translations with metadata for a single language
 */
export interface ICachedTranslations {
    data: ILanguageTranslations;
    language: string;
    timestamp: number;
    expiresAt: number;
}


