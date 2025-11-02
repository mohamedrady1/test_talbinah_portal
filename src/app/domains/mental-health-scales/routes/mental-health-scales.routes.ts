import { MentalHealthScalesRouteData } from '../constants';
import { Route } from '@angular/router';

export const MENTAL_HEALTH_SCALES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/mental-health-scales-layout').then(m => m.MentalHealthScalesLayoutComponent),
    data: MentalHealthScalesRouteData.MentalHealthScalesMainPage
  }
];
