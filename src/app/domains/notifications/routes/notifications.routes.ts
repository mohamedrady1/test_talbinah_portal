import { NotificationsRouteData } from '../constants';
import { Route } from '@angular/router';

export const NOTIFICATIONS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/notifications-layout').then(m => m.NotificationsLayoutComponent),
    data: NotificationsRouteData.NotificationsMainPage
  }
];
