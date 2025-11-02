import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../data-access';
import { StorageKeys } from '../../../shared';
import { Router } from '@angular/router';

const FROM_URL_KEY = makeStateKey<{ path: string; query: Record<string, any> }>(StorageKeys?.FROM_URL || 'from-url');

@Injectable({ providedIn: 'root' })
export class NavigationStateService {
  private readonly router = inject(Router);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(StorageService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  setFromUrl(
    path?: string,
    queryParams: Record<string, any> = {}
  ): void {
    const finalPath = path ?? this.router.url.split('?')[0];
    const finalQuery = path ? queryParams : this.router.getCurrentNavigation()?.extras?.queryParams ?? {};
    const redirectData = { path: finalPath, query: finalQuery };

    if (this.isBrowser) {
      this.storage.setItem(StorageKeys.FROM_URL, redirectData);
    } else {
      this.transferState.set(FROM_URL_KEY, redirectData);
    }
  }


  getFromUrl(): { path: string; query: Record<string, any> } | null {
    if (this.isBrowser) {
      const data = this.storage.getItem<{ path: string; query: Record<string, any> }>(StorageKeys.FROM_URL);
      return data ?? null;
    }

    if (this.transferState.hasKey(FROM_URL_KEY)) {
      const data = this.transferState.get(FROM_URL_KEY, null);
      this.transferState.remove(FROM_URL_KEY);
      return data;
    }

    return null;
  }

  clearFromUrl(): void {
    if (this.isBrowser) {
      this.storage.removeItem(StorageKeys.FROM_URL);
    } else {
      this.transferState.remove(FROM_URL_KEY);
    }
  }
}
