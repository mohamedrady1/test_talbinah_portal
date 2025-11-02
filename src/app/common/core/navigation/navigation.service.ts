import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { NavigationIntent } from './navigation-intent.enum';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Logger } from '../utilities';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  navigate(intent: NavigationIntent, pathOrUrl: string, queryParams: Record<string, any> = {}): void {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) {
      Logger.debug('[NavigationService] SSR: Navigation skipped', intent, pathOrUrl);
      return;
    }

    switch (intent) {
      case NavigationIntent.INTERNAL:
        this.router.navigate([pathOrUrl], { queryParams });
        break;
      case NavigationIntent.EXTERNAL_NEW_TAB:
        window.open(pathOrUrl, '_blank', 'noopener,noreferrer');
        break;
      case NavigationIntent.EXTERNAL_SAME_TAB:
        window.location.href = pathOrUrl;
        break;
      default:
        Logger.warn('[NavigationService] Unknown navigation intent', intent);
    }
  }
}
