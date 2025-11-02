import { AppointmentsRoutesEnum, AuthenticationRoutesEnum, MainPageRoutesEnum, MentalHealthScalesLayoutComponent, MentalHealthScalesRoutesEnum, PaymentsRoutesEnum, PodcastRoutesEnum, PodcastsMainPageComponent, SupportGroupsLayoutComponent, SupportGroupsRoutesEnum, KhawiikBotRoutesEnum } from './domains';
import { provideRouter, Routes } from '@angular/router';
import { TherapeuticProgramsRoutesEnum } from './domains/therapeutic-programs';
import { TalbinahCommunityRoutesEnum } from './domains/talbinah-community';
import { ArticlesRoutesEnum } from './domains/articles';
import { UrgentAppointmentRoutesEnum } from './domains/urgent-appointment';
import { BookAppointmentRoutesEnum } from './domains/book-appointment';
import { authGuard } from './common';
import { SettingsRoutesEnum } from './domains/settings';

export const appRoutes: Routes = [
  // {
  //   path: AuthenticationRoutesEnum.AUTHENTICATION,
  //   canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],
  //   loadChildren: () =>
  //     import('./domains/authentication').then(m => m.USER_AUTHENTICATION_ROUTES)
  // },
  {
    path: MainPageRoutesEnum.MAINPAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],
    loadChildren: () =>
      import('./domains/main-page').then(m => m.MAIN_PAGE_ROUTES)
    // component: HomeComponent

  },
  {
    path: BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE,
    loadChildren: () =>
      import('./domains/book-appointment').then(m => m.BOOK_APPOINTMENT_ROUTES)
  },

  {
    path: PodcastRoutesEnum.PODCASTSMAINPAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    // loadChildren: () =>
    //   import('./domains/podcasts').then(m => m.PODCASTS_ROUTES)
    component: PodcastsMainPageComponent
  },
  {
    path: MentalHealthScalesRoutesEnum.MENTALHEALTSCALESMAINPAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    // loadChildren: () =>
    //   import('./domains/mental-health-scales').then(m => m.MENTAL_HEALTH_SCALES_ROUTES)
    component: MentalHealthScalesLayoutComponent
  },
  {
    path: KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/talbinah-bot').then(m => m.TALBINAH_BOT_ROUTES)
  },
  {
    path: TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/talbinah-community').then(m => m.TALBINAH_COMMUNITY_ROUTES)
    // component: TalbinahCommunityComponent
  },

  {
    path: SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    // loadChildren: () =>
    //   import('./domains/support-groups').then(m => m.SUPPORT_GROUPS_ROUTES)
    component: SupportGroupsLayoutComponent
  },
  {
    path: TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/therapeutic-programs').then(m => m.THERAPEUTIC_PROGRAMS_ROUTES)
  },
  {
    path: UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/urgent-appointment').then(m => m.URGENT_APPOINTMENT_ROUTES)
  },
  {
    path: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
    canActivate: [authGuard([MainPageRoutesEnum.MAINPAGE])],

    loadChildren: () =>
      import('./domains/appointments').then(m => m.APPOINTMENTS_ROUTES)
  },
  {
    path: ArticlesRoutesEnum.ARTICLES_MAIN_PAGE,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/articles').then(m => m.ARTICLES_ROUTES)
  },
  {
    path: PaymentsRoutesEnum.PAYMENTS_ROUTES,
    // canActivate: [authGuard([AuthenticationRoutesEnum.AUTHENTICATION])],

    loadChildren: () =>
      import('./domains/payments').then(m => m.PAYMENTS_ROUTES)
  },

  {
    path: SettingsRoutesEnum.SETTINGS_MAIN_PAGE,
    canActivate: [authGuard([MainPageRoutesEnum.MAINPAGE])],

    loadChildren: () =>
      import('./domains/settings').then(m => m.SETTINGS_ROUTES)
  },
  {
    path: '',
    redirectTo: MainPageRoutesEnum.MAINPAGE,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: MainPageRoutesEnum.MAINPAGE
  },

];

export const AppRoutingProviders = provideRouter(appRoutes);
