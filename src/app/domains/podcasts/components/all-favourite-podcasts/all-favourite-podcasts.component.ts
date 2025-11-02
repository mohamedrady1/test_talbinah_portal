import { getFavoritePodcastsError, IFavoritePodcastsListingResponseDto, IPodcast, IPodcastsApiClient, ITogglePodcastFavoriteResponseDto, NoFavoritePodcasts, PodcastCardComponent, PodcastRoutesEnum, PodcastsApiClientProvider, PodcastsMainPageFacade } from '../../../../domains';
import { LocalizationService, PaginationConfig, ToastService, ErrorStateCardComponent, EmptyStateCardComponent, PaginationListingComponent } from '../../../../shared';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ApiError, defaultPaginationParameters, handleApiErrors, IPaginationParameters, Logger, PodcastItemType } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface FavouritePodcastsListState {
  favouritePodcastsResponse: IFavoritePodcastsListingResponseDto | null;
  isLoading: boolean;
  errorMessage: string | null;
  statusRequest: boolean;
  totalItems: number;
  currentPage?: number;
}
@Component({
  selector: 'app-all-favourite-podcasts',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PodcastCardComponent,
    AutoExactHeightDirective,
    PaginationListingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
  ],
  templateUrl: './all-favourite-podcasts.component.html',
  styleUrls: ['./all-favourite-podcasts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllFavouritePodcastsComponent {
  private readonly loadingFavouritesIds = signal<Set<string>>(new Set());
  private platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly facade = inject(PodcastsMainPageFacade);
  protected readonly isFullScreenFromAudio = signal<boolean>(false);
  readonly currentPage = signal<number>(1);

  isFullscreen: boolean = false;
  isAudioOpen: boolean = false;
  currentTime: number = 0;
  @ViewChild('card') cardRef!: ElementRef;

  selectedPodcast = signal<IPodcast | null>(null);

  // Use data from parent facade instead of local state
  readonly favouritePodcastsResponse = computed(() => this.facade.favouritePodcastsResponse());
  readonly isLoading = computed(() => this.facade.isLoadingFavouritePodcasts());
  readonly errorMessage = computed(() => null); // Using parent facade error handling
  readonly totalPages = computed(() => this.facade.favouritePodcastsResponse()?.data?.total || 0);

  readonly shouldShowPagination = computed(() => {
    const itemsCount = this.favouritePodcastsResponse()?.data?.data?.length ?? 0;
    return itemsCount > (this._paginationParams?.total ?? 1);
  });

  protected readonly favoritePodcastsError = getFavoritePodcastsError(() => this.facade.fetchFavouritePodcasts());
  protected readonly noFavoritePodcasts = NoFavoritePodcasts;

  private readonly localization = inject(LocalizationService);
  private _PodcastsApiClientProvider: IPodcastsApiClient = inject(PodcastsApiClientProvider).getClient();
  private cdr = inject(ChangeDetectorRef);
  private readonly _ToastService = inject(ToastService);
  PodcastItemTypes = PodcastItemType;
  private _paginationParams: IPaginationParameters = { ...defaultPaginationParameters, per_page: 1 };

  ngOnInit(): void {
    // This component should use data from the parent facade, not fetch its own
    // The parent component (podcasts-main-page) already handles data fetching
    Logger.debug('AllFavouritePodcastsComponent: ngOnInit - using data from parent facade');

    // Don't fetch here to avoid duplicate calls
    // The parent component already fetches the data
  }
  // Removed local fetch methods - using parent facade data instead
  protected toggleItemFavourite(podcast: IPodcast, type?: string): void {
    Logger.debug('Toggle Item Favourite:', {
      item: podcast,
      type: type
    });
    const originalIsBookmarked = podcast.is_bookmarked;

    const currentLoading = new Set(this.loadingFavouritesIds());
    currentLoading.add(String(podcast.id));
    this.loadingFavouritesIds.set(currentLoading);

    this._PodcastsApiClientProvider.toggleFavorite(podcast.id)
      .pipe(
        tap((response: ITogglePodcastFavoriteResponseDto) => {
          if (response && response.status) {
            Logger.debug('Toggle Item Favourite Podcast fetched successfully:', response);

            // Don't fetch favourites here to avoid duplicate calls
            // The toggle-favorite-podcast.facade will handle the refresh
            this.selectedPodcast.set(podcast);

          } else {
            Logger.debug('Toggle Item Favourite Podcast fetch failed:', response.message);
            this._ToastService.add({
              severity: 'error',
              summary: this.localization.translateTextFromJson('general.error'),
              detail: response?.message || this.localization.translateTextFromJson('general.failedUpdateFavoriteStatus'),
              life: 5000
            });
          }
        }),
        catchError((error: ApiError) => {
          Logger.error('Error toggling favorite status:', error);
          handleApiErrors(error);
          this._ToastService.add({
            severity: 'error',
            summary: this.localization.translateTextFromJson('general.error'),
            detail: error?.message ?? this.localization.translateTextFromJson('general.errorUpdatingFavoriteStatus'),
            life: 5000
          });

          return EMPTY;
        }),
        finalize(() => {
          this.cdr.markForCheck();
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  protected isFavouriteLoading(id: string): boolean {
    return this.loadingFavouritesIds().has(id);
  }
  // Removed updateFavouritePodcastsState - using parent facade data instead

  protected closeAudio(): void {
    this.currentTime = 0;
    this.isAudioOpen = false;
  }

  protected openPopupFromChild(podcast: IPodcast) {
    if (podcast != this.selectedPodcast()) {
      this.currentTime = 0;
      this.isAudioOpen = false;
    }
    this.selectedPodcast.set(podcast);
    setTimeout(() => {
      this.isAudioOpen = true;
    }, 0);
  }
  protected toggleFullscreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardEl = this.cardRef?.nativeElement;
      if (!cardEl) {
        console.warn('Fullscreen target element not found for generic toggleFullscreen.');
        return;
      }
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch((err: any) => {
          console.error('Failed to enter fullscreen:', err);
          this.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }

  protected goToPodcasts(): void {
    this.router.navigate([PodcastRoutesEnum.PODCASTSMAINPAGE]);
  }

  readonly paginationConfig = signal<PaginationConfig>({
    currentPage: this.currentPage(),
    totalPages: this.totalPages(),
    onPageChange: this.handlePageChange.bind(this)
  });
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  private handlePageChange(page: number): void {
    // Page change handled by parent facade
    Logger.debug('Page change requested:', page);
    // The parent facade will handle pagination
  }
}

