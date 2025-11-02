import { AppointmentsRoutesEnum } from '../constants';
import { Route } from '@angular/router';

export const APPOINTMENTS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./../containers/appointments-layout').then(m => m.AppointmentsLayoutComponent),
    data: { page: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./../components/appointments-listing').then(m => m.AppointmentsListingComponent),
        data: { page: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE }
      },
      {
        path: AppointmentsRoutesEnum.APPOINTMENTS_SESSION + '/:id',
        loadComponent: () =>
          import('./../components/session-with-doctor').then(m => m.SessionWithDoctorComponent),
        data: { page: AppointmentsRoutesEnum.APPOINTMENTS_SESSION }
      },
      {
        path: '**',
        redirectTo: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
      }
    ]
  }
];
