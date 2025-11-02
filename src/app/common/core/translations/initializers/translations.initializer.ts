import { inject } from '@angular/core';
import { TranslationsFacade } from '../services';
import { StorageService } from '../../data-access';
import { StorageKeys } from '../../../../shared';
import { DEFAULT_LANGUAGE_CODE } from '../../../../domains';
import { Logger } from '../../utilities';
import { firstValueFrom } from 'rxjs';

/**
 * Translations Initializer Factory
 * Creates an initializer function for APP_INITIALIZER
 * Loads translations for the current/default language at application startup
 * 
 * @returns Initializer function that returns a Promise
 */
export function translationsInitializerFactory(): () => Promise<void> {
    const translationsFacade = inject(TranslationsFacade);
    const storageService = inject(StorageService);

    return () => {
        // Get current language from storage or use default
        const currentLang = storageService.getItem<string>(StorageKeys.LANGUAGE) || DEFAULT_LANGUAGE_CODE;

        Logger.debug(`[TranslationsInitializer] Starting translations initialization for ${currentLang}`);

        return firstValueFrom(translationsFacade.initialize(currentLang))
            .then(() => {
                Logger.debug(`[TranslationsInitializer] ${currentLang} translations initialized successfully`);
            })
            .catch(error => {
                Logger.error('[TranslationsInitializer] Failed to initialize translations', error);
                // Don't throw error to prevent app from crashing
                // Translations will fallback to keys if not loaded
            });
    };
}


