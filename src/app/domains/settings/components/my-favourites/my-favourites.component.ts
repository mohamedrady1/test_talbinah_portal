import { ChangeDetectionStrategy, Component, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppointmentCardSkeletonComponent } from '../../../appointments';
import { ErrorStateCardComponent, EmptyStateCardComponent } from "../../../../shared";
import { VisitReportCardComponent } from "../visit-report-card";
import { PaginationListingComponent } from "../../../../shared";
import { AutoExactHeightDirective } from '../../../../common';
import { FavoriteDoctorsFacade } from '../../services';
import { FavoritePodcastsFacade } from '../../../podcasts';
import { MyFavouritesArticlesEmptyState, MyFavouritesDoctorsEmptyState, MyFavouritesPodcastsEmptyState, MyFavouritesDoctorsErrorState, MyFavouritesPodcastsErrorState, MyFavouritesArticlesErrorState } from '../../configs';
import { DoctorCardForFavouriteComponent } from '../doctor-card-for-favourite';
import { ArticleCardComponent, FavoriteArticlesFacade } from '../../../articles';
import { PodcastCardForFavouriteComponent } from '../podcast-card-for-favourite';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-my-favourites',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentCardSkeletonComponent,
    ErrorStateCardComponent,
    PaginationListingComponent,
    AutoExactHeightDirective,
    VisitReportCardComponent,
    EmptyStateCardComponent,
    DoctorCardForFavouriteComponent,
    PodcastCardForFavouriteComponent,
    ArticleCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './my-favourites.component.html',
  styleUrls: ['./my-favourites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFavouritesComponent {
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly _FavoritePodcastsFacade = inject(FavoritePodcastsFacade);
  protected readonly _FavoriteDoctorsFacade = inject(FavoriteDoctorsFacade);
  protected readonly _FavoriteArticlesFacade = inject(FavoriteArticlesFacade);

  doctorsEmptyState = MyFavouritesDoctorsEmptyState;
  podcastsEmptyState = MyFavouritesPodcastsEmptyState;
  articlesEmptyState = MyFavouritesArticlesEmptyState;
  doctorsErrorState = MyFavouritesDoctorsErrorState(() => this._FavoriteDoctorsFacade.fetchFavorites());
  podcastsErrorState = MyFavouritesPodcastsErrorState(() => this._FavoritePodcastsFacade.fetchFavorites());
  articlesErrorState = MyFavouritesArticlesErrorState(() => this._FavoriteArticlesFacade.fetchFavoriteArticles());

  protected selected = signal<'doctors' | 'podcasts' | 'articles'>('doctors');
  protected currentPage = signal(1);

  protected readonly pageSize = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return 6;
    if (tab === 'podcasts') return 10;
    return 6; // default, can adjust for articles later
  });

  protected readonly totalPages = computed(() => {
    const length = this.responseLength();
    const size = this.pageSize();
    return Math.max(1, Math.ceil(length / size));
  });

  protected readonly pagedData = computed(() => {
    const data = this.responseData();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  });

  protected readonly paginationConfig = computed(() => ({
    totalPages: this.totalPages(),
    currentPage: this.currentPage(),
    onPageChange: (page: number) => this.currentPage.set(page),
  }));

  protected selectTab(tab: 'doctors' | 'podcasts' | 'articles'): void {
    if (!this.isBrowser) return;
    this.selected.set(tab);
    this.currentPage.set(1); // Reset page on tab change
    this.fetchFavourites(tab);
  }

  protected ngOnInit(): void {
    if (!this.isBrowser) return;
    this.fetchFavourites(this.selected());
  }

  protected fetchFavourites(type: 'doctors' | 'podcasts' | 'articles') {
    if (type === 'podcasts') this._FavoritePodcastsFacade.fetchFavorites();
    if (type === 'doctors') this._FavoriteDoctorsFacade.fetchFavorites();
    if (type === 'articles') this._FavoriteArticlesFacade.fetchFavoriteArticles();
  }

  // ───────────── Unified UI States ─────────────

  protected readonly isLoading = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return this._FavoriteDoctorsFacade.isLoading();
    if (tab === 'podcasts') return this._FavoritePodcastsFacade.isLoading();
    if (tab === 'articles') return this._FavoriteArticlesFacade.isLoading();
    return false;
  });


  protected readonly errorMessage = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return this._FavoriteDoctorsFacade.errorMessage();
    if (tab === 'podcasts') return this._FavoritePodcastsFacade.errorMessage();
    if (tab === 'articles') return this._FavoriteArticlesFacade.errorMessage();
    return null;
  });

  protected readonly status = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return this._FavoriteDoctorsFacade.status();
    if (tab === 'podcasts') return this._FavoritePodcastsFacade.status();
    if (tab === 'articles') return this._FavoriteArticlesFacade.status();
    return false;
  });

  protected readonly responseLength = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return this._FavoriteDoctorsFacade.response()?.data?.data?.length || 0;
    if (tab === 'podcasts') return this._FavoritePodcastsFacade.response()?.data?.data?.length || 0;
    if (tab === 'articles') return this._FavoriteArticlesFacade.favoriteArticles()?.length || 0;
    return 0;
  });

  protected readonly responseData = computed(() => {
    const tab = this.selected();
    if (tab === 'doctors') return this._FavoriteDoctorsFacade.response()?.data?.data || [];
    if (tab === 'podcasts') return this._FavoritePodcastsFacade.response()?.data?.data || [];
    if (tab === 'articles') return this._FavoriteArticlesFacade.favoriteArticles() || [];
    return [];
  });
}
