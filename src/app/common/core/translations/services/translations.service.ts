import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { TranslationsApiClient, TranslationsApiMockClient } from '../clients';
import { ILanguageTranslations, ICachedTranslations } from '../dtos';
import { StorageService } from '../../data-access';
import { Logger } from '../../utilities';
import {
    ITranslationCacheConfig,
    DEFAULT_TRANSLATION_CACHE_CONFIG,
    TRANSLATION_KEYS
} from '../models';
import { TransferStateService } from '../../../function';

/**
 * Translations Service
 * Handles translation data fetching, caching, and expiration
 * Supports SSR with TransferState and browser caching with localStorage
 * 
 * Strategy:
 * - Fetches only the current language from API
 * - Caches each language separately
 * - Switches language on demand
 */
@Injectable({
    providedIn: 'root',
})
export class TranslationsService {
    private readonly realApiClient = inject(TranslationsApiClient);
    private readonly mockApiClient = inject(TranslationsApiMockClient);
    private readonly storageService = inject(StorageService);
    private readonly transferState = inject(TransferStateService);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly config: ITranslationCacheConfig = DEFAULT_TRANSLATION_CACHE_CONFIG;
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly isServer = isPlatformServer(this.platformId);

    /**
     * Get the appropriate API client based on configuration
     */
    private get apiClient() {
        return this.config.useMock ? this.mockApiClient : this.realApiClient;
    }

    /**
     * Get translations for a specific language with caching and expiration support
     * Priority: TransferState (SSR) -> LocalStorage (with expiration check) -> API
     * 
     * @param lang Language code (ar, en)
     * @returns Observable with translations data
     */
    getTranslations(lang: string): Observable<ILanguageTranslations> {
        Logger.debug(`[TranslationsService] getTranslations called for ${lang}`);

        // 1. Try to get from TransferState (SSR hydration)
        if (this.isBrowser && this.config.useTransferState) {
            const transferredData = this.getFromTransferState(lang);
            if (transferredData) {
                Logger.debug(`[TranslationsService] ✅ Loaded ${lang} from TransferState`, {
                    keysCount: Object.keys(transferredData).length
                });
                return of(transferredData);
            }
            Logger.debug(`[TranslationsService] ❌ Not found in TransferState for ${lang}`);
        }

        // 2. Try to get from localStorage (browser cache)
        if (this.isBrowser && this.config.useLocalStorage) {
            const cachedData = this.getFromCache(lang);
            if (cachedData) {
                Logger.debug(`[TranslationsService] ✅ Loaded ${lang} from localStorage cache`, {
                    keysCount: Object.keys(cachedData).length
                });
                return of(cachedData);
            }
            Logger.debug(`[TranslationsService] ❌ Not found in localStorage for ${lang}`);
        }

        // 3. Fetch from API
        Logger.debug(`[TranslationsService] 🌐 Fetching ${lang} from API`);
        return this.fetchFromApi(lang);
    }

    /**
     * Fetch translations from API and cache them
     * 
     * @param lang Language code (ar, en)
     * @returns Observable with translations data
     */
    private fetchFromApi(lang: string): Observable<ILanguageTranslations> {
        Logger.debug(`[TranslationsService] 🌐 Making API call for ${lang}`, {
            endpoint: `${this.config.useMock ? 'MOCK' : 'REAL API'}`,
            useMock: this.config.useMock
        });

        return this.apiClient.getTranslations(lang).pipe(
            map(response => {
                Logger.debug(`[TranslationsService] 📥 API Response received for ${lang}`, {
                    status: response.status,
                    message: response.message,
                    dataKeysCount: Object.keys(response.data).length
                });
                return response.data;
            }),
            tap(data => {
                Logger.debug(`[TranslationsService] 💾 Caching ${lang} translations`, {
                    isServer: this.isServer,
                    isBrowser: this.isBrowser,
                    willSaveToTransferState: this.isServer && this.config.useTransferState,
                    willSaveToLocalStorage: this.isBrowser && this.config.useLocalStorage
                });

                // Cache in TransferState for SSR
                if (this.isServer && this.config.useTransferState) {
                    this.saveToTransferState(lang, data);
                }

                // Cache in localStorage for browser
                if (this.isBrowser && this.config.useLocalStorage) {
                    this.saveToCache(lang, data);
                }

                Logger.debug(`[TranslationsService] ✅ ${lang} translations fetched and cached successfully`);
            }),
            catchError(error => {
                Logger.error(`[TranslationsService] ❌ Failed to fetch ${lang} translations`, error);
                // Fallback: return empty translations object to prevent app crash
                return of({} as ILanguageTranslations);
            })
        );
    }

    /**
     * Get translations from TransferState
     * 
     * @param lang Language code
     * @returns Translations data or null if not found
     */
    private getFromTransferState(lang: string): ILanguageTranslations | null {
        const key = lang === 'ar' ? TRANSLATION_KEYS.TRANSFER_STATE_AR : TRANSLATION_KEYS.TRANSFER_STATE_EN;
        const data = this.transferState.get<ILanguageTranslations>(key);

        if (data) {
            // Remove from TransferState after reading to prevent memory leak
            this.transferState.remove(key);
            return data;
        }

        return null;
    }

    /**
     * Save translations to TransferState (for SSR)
     * 
     * @param lang Language code
     * @param data Translations data to save
     */
    private saveToTransferState(lang: string, data: ILanguageTranslations): void {
        const key = lang === 'ar' ? TRANSLATION_KEYS.TRANSFER_STATE_AR : TRANSLATION_KEYS.TRANSFER_STATE_EN;
        this.transferState.set(key, data);
        Logger.debug(`[TranslationsService] Saved ${lang} to TransferState`);
    }

    /**
     * Get translations from localStorage cache with expiration check
     * 
     * @param lang Language code
     * @returns Translations data or null if not found or expired
     */
    private getFromCache(lang: string): ILanguageTranslations | null {
        try {
            const key = lang === 'ar' ? TRANSLATION_KEYS.STORAGE_AR : TRANSLATION_KEYS.STORAGE_EN;
            const cached = this.storageService.getItem<ICachedTranslations>(key);

            if (!cached) {
                return null;
            }

            const now = Date.now();

            // Check if cache is expired
            if (cached.expiresAt && now > cached.expiresAt) {
                Logger.debug(`[TranslationsService] ${lang} cache expired, clearing`);
                this.clearCache(lang);
                return null;
            }

            return cached.data;
        } catch (error) {
            Logger.error(`[TranslationsService] Error reading ${lang} from cache`, error);
            this.clearCache(lang);
            return null;
        }
    }

    /**
     * Save translations to localStorage cache with expiration
     * 
     * @param lang Language code
     * @param data Translations data to save
     */
    private saveToCache(lang: string, data: ILanguageTranslations): void {
        try {
            const now = Date.now();
            const expiresAt = now + (this.config.cacheDuration || DEFAULT_TRANSLATION_CACHE_CONFIG.cacheDuration!);

            const cachedData: ICachedTranslations = {
                data,
                language: lang,
                timestamp: now,
                expiresAt,
            };

            const key = lang === 'ar' ? TRANSLATION_KEYS.STORAGE_AR : TRANSLATION_KEYS.STORAGE_EN;

            // Important: isPersist = true to save in localStorage (not sessionStorage)
            this.storageService.setItem(key, cachedData, true);

            Logger.debug(`[TranslationsService] Saved ${lang} to localStorage cache`, {
                key,
                expiresAt: new Date(expiresAt).toISOString(),
                duration: this.config.cacheDuration,
                dataKeys: Object.keys(data).length,
            });
        } catch (error) {
            Logger.error(`[TranslationsService] Error saving ${lang} to cache`, error);
        }
    }

    /**
     * Clear translations cache for a specific language
     * 
     * @param lang Language code (if not provided, clears all)
     */
    clearCache(lang?: string): void {
        if (!this.isBrowser) return;

        if (lang) {
            const key = lang === 'ar' ? TRANSLATION_KEYS.STORAGE_AR : TRANSLATION_KEYS.STORAGE_EN;
            this.storageService.removeItem(key);
            Logger.debug(`[TranslationsService] ${lang} cache cleared`);
        } else {
            // Clear both languages
            this.storageService.removeItem(TRANSLATION_KEYS.STORAGE_AR);
            this.storageService.removeItem(TRANSLATION_KEYS.STORAGE_EN);
            Logger.debug('[TranslationsService] All caches cleared');
        }
    }

    /**
     * Check if cache is valid (exists and not expired) for a specific language
     * 
     * @param lang Language code
     * @returns true if cache is valid, false otherwise
     */
    isCacheValid(lang: string): boolean {
        if (!this.isBrowser || !this.config.useLocalStorage) {
            return false;
        }

        try {
            const key = lang === 'ar' ? TRANSLATION_KEYS.STORAGE_AR : TRANSLATION_KEYS.STORAGE_EN;
            const cached = this.storageService.getItem<ICachedTranslations>(key);

            if (!cached) {
                return false;
            }

            const now = Date.now();
            return cached.expiresAt ? now <= cached.expiresAt : false;
        } catch {
            return false;
        }
    }

    /**
     * Get cache expiration time for a specific language
     * 
     * @param lang Language code
     * @returns Expiration timestamp or null if no cache
     */
    getCacheExpiration(lang: string): number | null {
        if (!this.isBrowser || !this.config.useLocalStorage) {
            return null;
        }

        try {
            const key = lang === 'ar' ? TRANSLATION_KEYS.STORAGE_AR : TRANSLATION_KEYS.STORAGE_EN;
            const cached = this.storageService.getItem<ICachedTranslations>(key);
            return cached?.expiresAt || null;
        } catch {
            return null;
        }
    }

    /**
     * Force refresh translations from API for a specific language
     * Clears cache and fetches new data
     * 
     * @param lang Language code
     * @returns Observable with fresh translations data
     */
    forceRefresh(lang: string): Observable<ILanguageTranslations> {
        this.clearCache(lang);
        return this.fetchFromApi(lang);
    }
}


