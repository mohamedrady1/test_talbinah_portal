import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DEFAULT_LANGUAGE_CODE } from '../../../domains';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../common';
import { ILocalizationService } from '../domain';
import { StorageKeys } from '../../config';

@Injectable({ providedIn: 'root' })
export class LocalizationService implements ILocalizationService {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(StorageService);

  translateTextFromJson(key: string): string {
    return this.translate.instant(key);
  }

  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.storage.getItem<string>(StorageKeys.LANGUAGE) || DEFAULT_LANGUAGE_CODE;
    }
    return DEFAULT_LANGUAGE_CODE; // SSR fallback
  }
}
