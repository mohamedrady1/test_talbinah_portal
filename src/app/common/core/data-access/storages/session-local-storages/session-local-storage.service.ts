import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Logger } from '../../../utilities/logging/logger';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private getStorage(isPersist: boolean = false): Storage | undefined {
    if (!this.isBrowser) return undefined;
    return isPersist ? localStorage : sessionStorage;
  }

  setItem<T>(key: string, value: T, isPersist: boolean = false): void {
    const storage = this.getStorage(isPersist);
    try {
      storage?.setItem(key, JSON.stringify(value));
    } catch (e) {
      Logger.warn(`StorageService.setItem error for key ${key}`, e);
    }
  }

  getItem<T>(key: string): T | undefined {
    if (!this.isBrowser) return undefined;

    try {
      const sessionValue = sessionStorage?.getItem(key);
      if (sessionValue) return JSON.parse(sessionValue);

      const localValue = localStorage?.getItem(key);
      return localValue ? JSON.parse(localValue) : undefined;
    } catch (e) {
      Logger.warn(`StorageService.getItem error for key ${key}`, e);
      return undefined;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      sessionStorage?.removeItem(key);
      localStorage?.removeItem(key);
    } catch (e) {
      Logger.warn(`StorageService.removeItem error for key ${key}`, e);
    }
  }

  clearAll(): void {
    if (!this.isBrowser) return;

    try {
      // sessionStorage?.clear();
      // localStorage?.clear();
    } catch (e) {
      Logger.warn('StorageService.clearAll error', e);
    }
  }
}
// Usage example:
// const storage = inject(StorageService);
// storage.setItem(LocalStorageKeys.LANGUAGE, 'en');
// const lang = storage.getItem<string>(LocalStorageKeys.LANGUAGE);

// storage.removeItem(LocalStorageKeys.LANGUAGE);
// storage.clearAll(); // Clears both session and local storage
// storage.setItem(LocalStorageKeys.ACCESS_TOKEN, 'your-token', true); // Set in local storage
// const token = storage.getItem<string>(LocalStorageKeys.ACCESS_TOKEN); // Get from local storage
// storage.removeItem(LocalStorageKeys.ACCESS_TOKEN); // Remove from local storage
// storage.setItem(LocalStorageKeys.CURRENT_USER_INFO, { name: 'John Doe' }); // Set in session storage
// const userInfo = storage.getItem<{ name: string }>(LocalStorageKeys.CURRENT_USER_INFO); // Get from session storage
// storage.removeItem(LocalStorageKeys.CURRENT_USER_INFO); // Remove from session storage
// storage.clearAll(); // Clears both session and local storage
