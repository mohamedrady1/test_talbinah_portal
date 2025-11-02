// src/app/features/payments/payments.routes.ts

import { Route } from '@angular/router';
import { PaymentsRouteData, PaymentsRoutesEnum } from '../constants';

export const PAYMENTS_ROUTES: Route[] = [
  {
    path: PaymentsRoutesEnum.PAYMENTS_ROUTE_MAIN, // This is ''
    loadComponent: () =>
      import('./../containers/payments-layout/payments-layout.component').then(m => m.PaymentsLayoutComponent),
    data: PaymentsRouteData.PaymentsMainPage,
    children: [
      {
        path: '',
        redirectTo: PaymentsRoutesEnum.PAYMENTS_ROUTE_STATUS,
        pathMatch: 'full',
      },
      {
        path: PaymentsRoutesEnum.PAYMENTS_ROUTE_STATUS, // This is 'status'
        loadComponent: () =>
          import('./../components/payment-status/payment-status.component').then(m => m.PaymentStatusComponent),
      },
      // ... other child routes
    ]
  },
  {
    path: '**',
    redirectTo: PaymentsRoutesEnum.PAYMENTS_ROUTE_MAIN,
    pathMatch: 'full',
  },
];
