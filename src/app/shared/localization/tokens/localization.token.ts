import { InjectionToken } from '@angular/core';
import { ILocalizationService } from '../domain';

export const LOCALIZATION_SERVICE = new InjectionToken<ILocalizationService>('LocalizationService');
