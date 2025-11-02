import { SupportGroupsRouteData } from '../constants';
import { Route } from '@angular/router';

export const SUPPORT_GROUPS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/support-groups-layout').then(m => m.SupportGroupsLayoutComponent),
    data: SupportGroupsRouteData.SupportGroupsMainPage
  }
];
