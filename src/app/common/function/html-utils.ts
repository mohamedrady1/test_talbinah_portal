import { inject, PLATFORM_ID, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Converts HTML to plain text. Must be called from an Angular context
 */
export function htmlToPlainText(html: string, injector: EnvironmentInjector): string {
  return runInInjectionContext(injector, () => {
    const platformId = inject(PLATFORM_ID);

    if (!html) return '';

    if (isPlatformBrowser(platformId)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.textContent?.trim() ?? '';
    } else {
      return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
    }
  });
}
