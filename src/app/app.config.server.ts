// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
// import { provideServerRendering } from '@angular/platform-server';
// import { provideServerRouting } from '@angular/ssr';
// import { serverRoutes } from './app.routes.server';
// import { providePrimeNG } from 'primeng/config';
// import { appConfig } from './app.config';
// import Aura from '@primeng/themes/aura';

// const serverConfig: ApplicationConfig = {
//   providers: [
//     provideServerRendering()
//     // })
//   ],
// };

// export const config = mergeApplicationConfig(appConfig, serverConfig);

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
