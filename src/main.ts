import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isPlatformBrowser } from '@angular/common';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(reg => console.log('[main.ts] Service Worker registered:', reg.scope))
        .catch(err => console.error('[main.ts] Service Worker registration failed:', err));
    }
  })
  .catch((err) => console.error(err));
