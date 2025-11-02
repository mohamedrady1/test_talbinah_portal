import { UrgentAppointmentRouteData } from '../constants';
import { Route } from '@angular/router';

export const URGENT_APPOINTMENT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../containers/urgent-appointment-layout').then(m => m.UrgentAppointmentLayoutComponent),
    data: UrgentAppointmentRouteData.UrgentAppointmentMainPage
  }
];
