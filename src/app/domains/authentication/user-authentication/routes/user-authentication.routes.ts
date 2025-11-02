import { UserAuthLayoutComponent } from '../components';
import { UserAuthRouteData } from '../constants';
import { Routes } from '@angular/router';

export const USER_AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    component: UserAuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      {
        path: 'login',
        loadComponent: () =>
          import('../components/login/login.component').then(m => m.LoginComponent),
        data: UserAuthRouteData.login
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../components/user-registration/user-registration.component').then(m => m.UserRegistrationComponent),
        // data: UserAuthRouteData.register
      },
      {
        path: 'password',
        loadComponent: () =>
          import('../components/login-password/login-password.component').then(m => m.LoginPasswordComponent),
        // data: UserAuthRouteData.register
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('../components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        // data: UserAuthRouteData.register
      },
      {
        path: 'verify-code',
        loadComponent: () =>
          import('../components/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent),
        data: UserAuthRouteData.otpVerification
      }
    ]
  }
];
