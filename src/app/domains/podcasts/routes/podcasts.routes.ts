import { Route } from '@angular/router';
import { PodcastsRouteData } from '../constants';

export const PODCASTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/podcasts-layout').then(m => m.PodcastsLayoutComponent),
    data: PodcastsRouteData.PodcastsMainPage
  }
];
