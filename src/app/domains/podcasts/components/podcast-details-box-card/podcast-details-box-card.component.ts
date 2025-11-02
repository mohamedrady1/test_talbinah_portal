import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { FavoritePodcastsFacade, ToggleFavoritePodcastFacade } from '../../services';
import { ToastService } from '../../../../shared/services/toast-service.service';
import { LocalizationService, StorageKeys } from '../../../../shared';
import { PodcastDetailsBoxCardConstants } from '../../constants';
import { IGlobalPodcastItemModel, StorageService } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { RoleGuardService } from '../../../authentication';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-podcast-details-box-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,

    LazyLoadImageDirective,
    TranslateApiPipe
  ],
  templateUrl: './podcast-details-box-card.component.html',
  styleUrls: ['./podcast-details-box-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastDetailsBoxCardComponent {
  @Input({ required: true }) item!: IGlobalPodcastItemModel;
  @Input() isBookMarked = signal<boolean>(false);
  @Input() isloadingFavourite = false;
  @Input() externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);
  @Input() isMobile = false;

  @Output() cardClicked = new EventEmitter<IGlobalPodcastItemModel>();
  @Output() favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();
  @Output() playPodcast = new EventEmitter<void>();

  protected currentLanguage!: string;
  protected readonly constants = PodcastDetailsBoxCardConstants;
  protected readonly _ToggleFavoritePodcastFacade = inject(ToggleFavoritePodcastFacade);
  protected isToggleLoading = computed(() =>
    this.item && this._ToggleFavoritePodcastFacade.loadingPodcastIds().has(this.item.id)
  );

  private readonly _LocalizationService = inject(LocalizationService);
  private readonly _ToastService = inject(ToastService);
  private readonly favouritePodcastFacade = inject(FavoritePodcastsFacade);
  private readonly platformId = inject(PLATFORM_ID);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);

  // ----- Auth / Guest Computed -----
  public readonly isLoggedIn = computed(() => {
    if (!this.isBrowser) return false;
    const token = this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null;
    return !!token;
  });



  constructor() {
    effect(() => {
      const external = this.externalFavouriteToggled();
      if (external) this.item = external;
    });
  }

  ngOnInit(): void {
    if (this.item?.is_bookmarked !== undefined) {
      this.isBookMarked.set(this.item.is_bookmarked ?? false);
    }
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this._LocalizationService.getCurrentLanguage();
    }
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.item || this.isToggleLoading()) return;

    this._ToggleFavoritePodcastFacade.togglePodcastFavorite(this.item.id).subscribe({
      next: () => {
        this.favouriteToggled.emit(this.item);
        this.item.is_bookmarked = !this.item.is_bookmarked;
      },
      error: () => {
        this._ToastService.add({
          severity: 'error',
          summary: 'general.error',
          detail: 'general.errorUpdatingFavoriteStatus',
          life: 5000,
        });
      },
    });

    this.favouritePodcastFacade.fetchFavorites();
  }

  protected onCardClicked(podcast: IGlobalPodcastItemModel): void {
    this.cardClicked.emit(podcast);
  }

  protected onPlayPodcast(): void {
    this.playPodcast.emit();
  }
}
