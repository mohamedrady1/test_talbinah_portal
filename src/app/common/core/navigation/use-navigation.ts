import { NavigationStateService } from './navigation-state.service';
import { NavigationIntent } from './navigation-intent.enum';
import { AuthenticationRoutesEnum } from '../../../domains';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Logger } from '../utilities';

export function useNavigation() {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const isBrowser = isPlatformBrowser(platformId);
  const navigationState = inject(NavigationStateService);

  function navigate(intent: NavigationIntent, pathOrUrl: string, queryParams: Record<string, any> = {}) {
    if (!isBrowser) {
      Logger.debug('[useNavigation] SSR: Navigation skipped', intent, pathOrUrl);
      return;
    }

    switch (intent) {
      case NavigationIntent.INTERNAL:
        router.navigate([pathOrUrl], { queryParams });
        break;
      case NavigationIntent.EXTERNAL_NEW_TAB:
        window.open(pathOrUrl, '_blank', 'noopener,noreferrer');
        break;
      case NavigationIntent.EXTERNAL_SAME_TAB:
        window.location.href = pathOrUrl;
        break;
      default:
        Logger.warn('[useNavigation] Unknown navigation intent', intent);
    }
  }

  return { navigate };
}

export function attemptRedirect(condition: boolean): void {
  const { navigate } = useNavigation();
  if (!condition) {
    navigate(NavigationIntent.INTERNAL, AuthenticationRoutesEnum.LOGIN);
  }
}
