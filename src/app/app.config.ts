// src/app/app.config.ts
import { offlineInterceptor, headersInterceptor, authInterceptor, errorInterceptor } from './common';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import Aura from '@primeng/themes/aura';

import localeAr from '@angular/common/locales/ar';
import { DEFAULT_LANGUAGE_CODE } from './domains';

import { firebaseConfig } from '../assets/environments/firebase.config';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

registerLocaleData(localeAr);

const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),

    provideRouter(appRoutes, withInMemoryScrolling({
      scrollPositionRestoration: 'top', // Always scroll to top on navigation
      anchorScrolling: 'enabled'
    })),
    provideHttpClient(
      withInterceptors([
        offlineInterceptor,
        headersInterceptor,
        authInterceptor,
        errorInterceptor,
      ]),
      withFetch()
    ),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: DEFAULT_LANGUAGE_CODE,
    }),

    providePrimeNG({ theme: { preset: Aura } }),
    {
      provide: LOCALE_ID,
      useValue: DEFAULT_LANGUAGE_CODE,
    },

    // Note: Translations will be loaded on-demand (not at startup)
    // They will load automatically when first pipe/facade usage happens
  ]
};