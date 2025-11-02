import { NavigationStateService } from './navigation-state.service';
import { NavigationIntent } from './navigation-intent.enum';
import { NavigationService } from './navigation.service';
import { CanActivateFn, UrlTree } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function autoRedirectGuardFactory(
  conditionFn: () => boolean | Promise<boolean> | UrlTree,
  redirectTo: string,
  intent: NavigationIntent = NavigationIntent.INTERNAL
): CanActivateFn {
  return async () => {
    const platformId = inject(PLATFORM_ID);
    const navigation = inject(NavigationService);
    const state = inject(NavigationStateService);
    const isBrowser = isPlatformBrowser(platformId);

    if (!isBrowser) {
      console.debug('[autoRedirectGuardFactory] SSR: Navigation skipped');
      return true;
    }

    const result = await conditionFn();

    if (result instanceof UrlTree) {
      return result;
    }

    if (!result) {
      state.setFromUrl();
      navigation.navigate(intent, redirectTo);
      return false;
    }

    return true;
  };
}
