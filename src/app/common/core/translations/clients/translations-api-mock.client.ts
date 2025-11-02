import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ITranslationsApiClient } from './i-translations-api.client';
import {
    ITranslationsApiResponse,
    MOCK_AR_TRANSLATIONS_RESPONSE,
    MOCK_EN_TRANSLATIONS_RESPONSE
} from '../dtos';

/**
 * Mock Translations API Client
 * For development and testing purposes
 * Returns mock data instead of making actual API calls
 */
@Injectable({
    providedIn: 'root',
})
export class TranslationsApiMockClient implements ITranslationsApiClient {
    private simulateNetworkDelay = true;
    private networkDelayMs = 500; // 500ms delay to simulate real API
    private simulateError = false; // Set to true to test error handling

    /**
     * Fetch translations for a specific language (mock)
     * @param lang Language code (ar, en)
     * @returns Observable with mock translations response for the specified language
     */
    getTranslations(lang: string): Observable<ITranslationsApiResponse> {
        if (this.simulateError) {
            return this.simulateNetworkDelay
                ? throwError(() => new Error('Mock API Error')).pipe(delay(this.networkDelayMs))
                : throwError(() => new Error('Mock API Error'));
        }

        const response = lang === 'ar'
            ? MOCK_AR_TRANSLATIONS_RESPONSE
            : MOCK_EN_TRANSLATIONS_RESPONSE;

        const data$ = of(response);
        return this.simulateNetworkDelay
            ? data$.pipe(delay(this.networkDelayMs))
            : data$;
    }

    /**
     * Configure mock client behavior
     * @param config Configuration options
     */
    configure(config: {
        simulateNetworkDelay?: boolean;
        networkDelayMs?: number;
        simulateError?: boolean;
    }): void {
        if (config.simulateNetworkDelay !== undefined) {
            this.simulateNetworkDelay = config.simulateNetworkDelay;
        }
        if (config.networkDelayMs !== undefined) {
            this.networkDelayMs = config.networkDelayMs;
        }
        if (config.simulateError !== undefined) {
            this.simulateError = config.simulateError;
        }
    }
}

