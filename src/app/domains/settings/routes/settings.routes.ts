import { Route } from '@angular/router';
import { SettingsRouteData } from '../constants';

export const SETTINGS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../containers/settings-layout').then(m => m.SettingsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('../components/settings-main-page').then(m => m.SettingsMainPageComponent),
        data: SettingsRouteData.SettingsMainPage
      }
    ]
  }
];
