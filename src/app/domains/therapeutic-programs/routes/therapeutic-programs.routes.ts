import { Route } from '@angular/router';
import { TherapeuticProgramsRouteData } from '../constants';

export const THERAPEUTIC_PROGRAMS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../containers/therapeutic-programs-layout').then(m => m.TherapeuticProgramsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('../components/therapeutic-programs-listing').then(m => m.TherapeuticProgramsListingComponent),
        data: TherapeuticProgramsRouteData.TherapeuticProgramsMainPage
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../components/therapeutic-programs-listing').then(m => m.TherapeuticProgramsListingComponent),
        data: TherapeuticProgramsRouteData.TherapeuticProgramsMainPage
      },
      // {
      //   path: ':id',
      //   loadComponent: () =>
      //     import('../components/therapeutic-program-details').then(m => m.TherapeuticProgramDetailsComponent),
      //   data: { title: 'Program Details' }
      // }
    ]
  }
];
