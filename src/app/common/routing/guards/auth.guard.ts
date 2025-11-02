import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthenticationRoutesEnum, MainPageRoutesEnum } from '../../../domains';
import { StorageKeys } from '../../../shared';
import { Logger, StorageService } from '../../core';

export function authGuard(allowedForAuthOnly: string[] = []): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const storage = inject(StorageService);

    const isBrowser = isPlatformBrowser(platformId);
    if (!isBrowser) return true;

    const isLoggedIn = !!storage.getItem(StorageKeys.TOKEN);
    const currentPath = route.routeConfig?.path || '';
    const isAuthPage = allowedForAuthOnly.includes(currentPath);

    // ===== SSR-safe store attempted URL =====
    if (isBrowser && !isAuthPage) {
      // Only store for non-auth pages
      storage.setItem(StorageKeys.REDIRECT_AFTER_LOGIN, state.url);
      Logger.debug('🌐 SSR-safe: Attempted URL stored:', state.url);
    }

    // ===== Redirect logic =====
    if (isLoggedIn && isAuthPage) {
      const redirectUrl = MainPageRoutesEnum.MAINPAGE;
      Logger.debug('🚫 Redirecting logged-in user from auth page to:', redirectUrl);
      return router.createUrlTree([redirectUrl]);
    }

    // ===== Modified: Don't redirect after logout =====
    if (!isLoggedIn && !isAuthPage) {
      // Check if this is a logout scenario by checking if user was recently logged in
      const wasRecentlyLoggedIn = storage.getItem('WAS_RECENTLY_LOGGED_IN');

      Logger.debug('🔍 Auth Guard Check - isLoggedIn:', isLoggedIn, 'isAuthPage:', isAuthPage, 'wasRecentlyLoggedIn:', wasRecentlyLoggedIn, 'currentUrl:', state.url);

      if (wasRecentlyLoggedIn) {
        // Clear the flag and allow access to current page (user just logged out)
        storage.removeItem('WAS_RECENTLY_LOGGED_IN');
        Logger.debug('✅ Allowing access after logout to:', state.url);

        // Set a timeout to clear the flag after 5 seconds as a safety measure
        setTimeout(() => {
          storage.removeItem('WAS_RECENTLY_LOGGED_IN');
          Logger.debug('🧹 Safety cleanup - Removed WAS_RECENTLY_LOGGED_IN flag after timeout');
        }, 5000);

        return true;
      }

      Logger.debug('🚫 Redirecting guest user to main page');
      const redirectUrl = MainPageRoutesEnum.MAINPAGE;
      return router.createUrlTree([redirectUrl]);
    }

    Logger.debug('✅ Access granted');
    return true;
  };
}

// ===== Helper to safely read the redirect URL =====
export function getRedirectAfterLogin(storage: StorageService, platformId: Object): string | null {
  if (!isPlatformBrowser(platformId)) return null; // SSR-safe
  return storage.getItem(StorageKeys.REDIRECT_AFTER_LOGIN) || null;
}

// ===== Helper to clear redirect URL after use =====
export function clearRedirectAfterLogin(storage: StorageService, platformId: Object): void {
  if (!isPlatformBrowser(platformId)) return;
  storage.removeItem(StorageKeys.REDIRECT_AFTER_LOGIN);
}
