import { Route } from '@angular/router';
import { ArticlesRouteData } from '../constants';

export const ARTICLES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../containers/articles-layout').then(m => m.ArticlesLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('../components/articles-listing').then(m => m.ArticlesListingComponent),
        data: ArticlesRouteData.ArticlesMainPage
      }
    ]
  }
];
