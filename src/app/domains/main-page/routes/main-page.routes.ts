import { MainPageRouteData, MainPageRoutesEnum } from '../constants';
import { Route } from '@angular/router';

export const MAIN_PAGE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/main-page-layout').then(m => m.MainPageLayoutComponent),
    data: MainPageRouteData.MainPage
  }
];
