import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { TranslationsService } from './translations.service';
import { ILanguageTranslations } from '../dtos';
import { Logger } from '../../utilities';
import { DEFAULT_LANGUAGE_CODE } from '../../../../domains';

/**
 * Translations Facade
 * Manages translation state and provides easy access to translations
 * Follows the Facade pattern used throughout the application
 * 
 * Strategy:
 * - Loads only the current language
 * - Caches each language separately
 * - Loads other languages on demand when switching
 */
@Injectable({
    providedIn: 'root',
})
export class TranslationsFacade {
    private readonly translationsService = inject(TranslationsService);

    // State signals for current language translations
    private readonly _currentTranslations = signal<ILanguageTranslations | null>(null);
    private readonly _isLoading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);
    private readonly _currentLanguage = signal<string>(DEFAULT_LANGUAGE_CODE);

    // Public read-only signals
    readonly currentTranslations = computed(() => this._currentTranslations());
    readonly isLoading = computed(() => this._isLoading());
    readonly error = computed(() => this._error());
    readonly currentLanguage = computed(() => this._currentLanguage());

    // Observable for components that need to subscribe
    private readonly _translationsSubject = new BehaviorSubject<ILanguageTranslations | null>(null);
    readonly translations$ = this._translationsSubject.asObservable();

    /**
     * Initialize translations for current language
     * Should be called once at application startup
     * 
     * @param lang Optional language code (defaults to current language)
     * @returns Observable that completes when translations are loaded
     */
    initialize(lang?: string): Observable<ILanguageTranslations> {
        const targetLang = lang || this._currentLanguage();

        // Check if already loaded for this language
        if (this._currentTranslations() && this._currentLanguage() === targetLang) {
            Logger.debug(`[TranslationsFacade] Already initialized for ${targetLang}`);
            return new Observable(observer => {
                observer.next(this._currentTranslations()!);
                observer.complete();
            });
        }

        Logger.debug(`[TranslationsFacade] Initializing translations for ${targetLang}`);
        this._isLoading.set(true);
        this._error.set(null);

        return this.translationsService.getTranslations(targetLang).pipe(
            tap(data => {
                this._currentTranslations.set(data);
                this._currentLanguage.set(targetLang);
                this._translationsSubject.next(data);
                this._error.set(null);
                Logger.debug(`[TranslationsFacade] ${targetLang} translations loaded successfully`);
            }),
            finalize(() => {
                this._isLoading.set(false);
            })
        );
    }

    /**
     * Set current language and load translations if needed
     * 
     * @param lang Language code (ar, en)
     * @param forceReload Force reload even if already loaded
     */
    setCurrentLanguage(lang: string, forceReload: boolean = false): void {
        const currentLang = this._currentLanguage();

        // If same language and not forcing reload, just update signal
        if (currentLang === lang && !forceReload) {
            Logger.debug(`[TranslationsFacade] Already on ${lang}`);
            return;
        }

        Logger.debug(`[TranslationsFacade] Changing language to ${lang}`);
        this._currentLanguage.set(lang);

        // Load translations for new language
        this.initialize(lang).subscribe();
    }

    /**
     * Get translation by key
     * Supports nested keys with dot notation (e.g., 'home.welcome.title')
     * 
     * @param key Translation key
     * @param lang Optional language override (will load if not cached)
     * @returns Translated text or key if not found
     */
    translate(key: string, lang?: string): string {
        const targetLang = lang || this._currentLanguage();
        const currentLang = this._currentLanguage();
        const translations = this._currentTranslations();

        Logger.debug(`[TranslationsFacade] translate called`, {
            key,
            requestedLang: lang,
            currentLang,
            hasTranslations: !!translations,
            translationsKeysCount: translations ? Object.keys(translations).length : 0
        });

        // If requesting different language than current, need to load it
        if (lang && lang !== currentLang) {
            Logger.warn(`[TranslationsFacade] ⚠️ Requested ${lang} but current is ${currentLang}. Returning key.`);
            return key;
        }

        if (!translations) {
            Logger.warn('[TranslationsFacade] ⚠️ Translations not loaded yet. Returning key.');
            return key;
        }

        const result = this.getNestedTranslation(translations, key);

        if (!result) {
            Logger.warn(`[TranslationsFacade] ⚠️ Translation key '${key}' not found. Returning key.`);
            return key;
        }

        Logger.debug(`[TranslationsFacade] ✅ Translation found for '${key}': '${result}'`);
        return result;
    }

    /**
     * Get nested translation using dot notation
     * 
     * @param translations Language translations object
     * @param key Dot-notated key (e.g., 'home.welcome.title')
     * @returns Translation value or null if not found
     */
    private getNestedTranslation(translations: ILanguageTranslations, key: string): string | null {
        const keys = key.split('.');
        let current: any = translations;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }

        return typeof current === 'string' ? current : null;
    }

    /**
     * Check if translations are loaded for current language
     * 
     * @returns true if translations are loaded
     */
    isInitialized(): boolean {
        return this._currentTranslations() !== null;
    }

    /**
     * Clear translations cache and reload for current language
     * 
     * @param lang Optional language code (defaults to current)
     * @returns Observable that completes when translations are reloaded
     */
    refresh(lang?: string): Observable<ILanguageTranslations> {
        const targetLang = lang || this._currentLanguage();

        Logger.debug(`[TranslationsFacade] Refreshing ${targetLang} translations`);
        this._isLoading.set(true);
        this._error.set(null);
        this._currentTranslations.set(null);
        this._translationsSubject.next(null);

        return this.translationsService.forceRefresh(targetLang).pipe(
            tap(data => {
                this._currentTranslations.set(data);
                this._currentLanguage.set(targetLang);
                this._translationsSubject.next(data);
                this._error.set(null);
                Logger.debug(`[TranslationsFacade] ${targetLang} translations refreshed successfully`);
            }),
            finalize(() => {
                this._isLoading.set(false);
            })
        );
    }

    /**
     * Check if cache is valid for a specific language
     * 
     * @param lang Language code (defaults to current)
     * @returns true if cache is valid
     */
    isCacheValid(lang?: string): boolean {
        const targetLang = lang || this._currentLanguage();
        return this.translationsService.isCacheValid(targetLang);
    }

    /**
     * Get cache expiration time for a specific language
     * 
     * @param lang Language code (defaults to current)
     * @returns Expiration timestamp or null
     */
    getCacheExpiration(lang?: string): number | null {
        const targetLang = lang || this._currentLanguage();
        return this.translationsService.getCacheExpiration(targetLang);
    }

    /**
     * Get current language translations
     * 
     * @returns Current language translations or null
     */
    getCurrentTranslations(): ILanguageTranslations | null {
        return this._currentTranslations();
    }

    /**
     * Check if a translation key exists in current language
     * 
     * @param key Translation key
     * @returns true if key exists
     */
    hasTranslation(key: string): boolean {
        const translations = this._currentTranslations();
        if (!translations) {
            return false;
        }
        return this.getNestedTranslation(translations, key) !== null;
    }
}


