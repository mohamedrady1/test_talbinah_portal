import { BookAppointmentRouteData } from '../constants';
import { Route } from '@angular/router';

export const BOOK_APPOINTMENT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/book-appointment-layout').then(m => m.BookAppointmentLayoutComponent),
    data: BookAppointmentRouteData.BookAppointmentMainPage
  }
];
