import { Observable } from 'rxjs';
import { ITranslationsApiResponse } from '../dtos';

/**
 * Interface for Translations API Client
 */
export interface ITranslationsApiClient {
    /**
     * Fetch translations for a specific language from the API
     * @param lang Language code (ar, en)
     * @returns Observable with translations response for the specified language
     */
    getTranslations(lang: string): Observable<ITranslationsApiResponse>;
}


