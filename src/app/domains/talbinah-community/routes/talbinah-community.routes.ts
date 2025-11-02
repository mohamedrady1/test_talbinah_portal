import { Route } from '@angular/router';
import { TalbinahCommunityRouteData, TalbinahCommunityRoutesEnum } from '../constants';

export const TALBINAH_COMMUNITY_ROUTES: Route[] = [
  {
    path: '',  // Root path
    loadComponent: () =>
      import('./../containers/talbinah-community-layout').then(m => m.TalbinahCommunityLayoutComponent),
    data: TalbinahCommunityRouteData.TalbinahCommunityMainPage,
    pathMatch: 'full',  // Must match full '' path exactly here
  },
  {
    path: `${TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE}/:id`,  // profile/:id
    loadComponent: () =>
      import('./../components/user-profile').then(m => m.UserProfileComponent),
    // Optional SEO data here or set dynamically inside UserProfileComponent
  }
];
