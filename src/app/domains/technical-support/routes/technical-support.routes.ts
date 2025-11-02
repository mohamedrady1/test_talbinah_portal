import { Route } from '@angular/router';
import { TechnicalSupportRouteData } from '../constants';

export const TECHNICAL_SUPPORT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../containers/technical-support-layout').then(m => m.TechnicalSupportLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
