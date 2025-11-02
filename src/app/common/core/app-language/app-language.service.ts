import { TranslateService } from '@ngx-translate/core';
import { Injectable, inject } from '@angular/core';
import { StorageService } from '../data-access';
import { StorageKeys } from '../../../shared';
import { DOCUMENT } from '@angular/common';
import { Logger } from '../utilities';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../../../domains';
import { TranslationsFacade } from '../translations';

@Injectable({ providedIn: 'root' })
export class AppLanguageService {
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);
  private readonly translationsFacade = inject(TranslationsFacade);

  initialize(): void {
    const storedLang = this.storage.getItem<string>(StorageKeys.LANGUAGE);
    // Logger.debug('storedLang: ' + storedLang);
    const browserLang = this.translate.getBrowserLang();
    const selectedLang = storedLang || DEFAULT_LANGUAGE_CODE || browserLang || AVAILABLE_LANGUAGES[0].code;

    this.translate.addLangs(AVAILABLE_LANGUAGES.map(l => l.code));
    this.translate.use(selectedLang);
    this.translate.setDefaultLang(selectedLang);
    this.setDirection(selectedLang);

    // Sync API translations facade with current language
    this.translationsFacade.setCurrentLanguage(selectedLang);
  }

  setDirection(lang: string): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const html = this.document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute(StorageKeys.LANGUAGE, lang);
    html.setAttribute('class', lang);

    // Update API translations facade when language changes
    this.translationsFacade.setCurrentLanguage(lang);
  }
}
