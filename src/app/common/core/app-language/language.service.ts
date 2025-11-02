import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../common';
import { StorageKeys } from '../../../shared';
import { DEFAULT_LANGUAGE_CODE } from '../../../domains';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(StorageService);

  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.storage.getItem<string>(StorageKeys.LANGUAGE) || DEFAULT_LANGUAGE_CODE;
    }
    return DEFAULT_LANGUAGE_CODE; // SSR fallback
  }
}
