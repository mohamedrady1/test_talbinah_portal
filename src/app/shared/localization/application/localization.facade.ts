import { inject } from '@angular/core';
import { ILocalizationService } from '../domain/services/i-localization.service';

/**
 * This must be called from within Angular DI context (component, service, etc.)
 */
export function useLocalization() {
  const service = inject(ILocalizationService);

  return {
    translate: (key: string) => service.translateTextFromJson(key),
    currentLanguage: () => service.getCurrentLanguage()
  };
}
