import { PodcastDetailsComponent, PodcastDetailsHeaderConfig, PodcastsListFacade, ToggleFavoritePodcastFacade } from '../../../podcasts';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { LocalizationService, ModalService, StorageKeys, ToastService } from '../../../../shared';
import { IGlobalPodcastItemModel, Logger, StorageService } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  EventEmitter,
  Component,
  Input,
  Output,
  inject,
  signal,
  computed,
  PLATFORM_ID
} from '@angular/core';
import { RoleGuardService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-podcast-card',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    LazyLoadImageDirective,
    
  ],
  templateUrl: './podcast-card.component.html',
  styleUrls: ['./podcast-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) item!: IGlobalPodcastItemModel | null;
  @Input() isTask!: { status: boolean } | null;
  @Input() hideFavouriteAction!: boolean | null;
  @Input() hideDescription!: boolean | null;
  @Input() preventDetailsModal!: boolean | null;
  @Input() actionNotWorking!: boolean | null;
  @Input() showButtonAction!: boolean | null;
  @Input() isMobile!: boolean | null;
  @Input() isborder!: boolean | null;
  @Input() allowShortTexts!: boolean | null;
  @Input() externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);
  @Input() hideButtonAction!: boolean | null;


  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Login State -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }


  @Output() cardClicked = new EventEmitter<IGlobalPodcastItemModel>();
  @Output() public favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();

  private readonly localizationService = inject(LocalizationService);
  readonly currentLang = this.localizationService.getCurrentLanguage();

  private readonly _PodcastsListFacade = inject(PodcastsListFacade);
  private readonly _modalService = inject(ModalService);
  private readonly _ToastService = inject(ToastService);

  protected readonly _ToggleFavoritePodcastFacade = inject(ToggleFavoritePodcastFacade);
  protected isToggleLoading = computed(() => {
    return this.item && this._ToggleFavoritePodcastFacade.loadingPodcastIds().has(this.item.id);
  });

  protected onCardClicked(podcast: IGlobalPodcastItemModel): void {
    this.cardClicked.emit(podcast);
    if (!this.preventDetailsModal && !this.actionNotWorking) {
      this.openPodcastDetailsModal();
    }
    else {
      this.ClosePodcastAudioPlayer();
    }
  }

  protected openPodcastDetailsModal(): void {
    this.ClosePodcastAudioPlayer();
    let modalInputs: any = {};
    let modalOutputs: any = {};

    // Check if this podcast is currently playing in the audio player
    const currentAudioPlayerState = this._PodcastsListFacade._openPodcastAudioPlayer$.value;
    const isCurrentlyPlaying = currentAudioPlayerState?.isOpen &&
      currentAudioPlayerState?.item?.id === this.item?.id;

    const currentTimeToPass = isCurrentlyPlaying ? currentAudioPlayerState?.currentTime : undefined;

    console.log('PodcastCardComponent.openPodcastDetailsModal:', {
      itemId: this.item?.id,
      currentAudioPlayerState: currentAudioPlayerState,
      isCurrentlyPlaying: isCurrentlyPlaying,
      currentTimeToPass: currentTimeToPass
    });

    modalInputs = {
      ...PodcastDetailsHeaderConfig,
      item: this.item,
      currentTime: currentTimeToPass
    };
    modalOutputs = {
    };

    this._modalService.open(PodcastDetailsComponent, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: '70%',
      height: '78vh'
    });
  }

  protected OpenPodcastAudioPlayer(): void {
    if (this.actionNotWorking) {
      return;
    }
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: true,
      item: this.item
    });
  }

  protected ClosePodcastAudioPlayer(): void {
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: false,
      item: null
    });
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.item || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid item or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for podcast ID:', this.item.id);

    this._ToggleFavoritePodcastFacade.togglePodcastFavorite(this.item.id)
      .subscribe({
        next: () => {
          Logger.debug(`Favorite toggle for podcast ${this.item?.id} request completed.`);
          this.favouriteToggled.emit(this.item!);
          this.item!.is_bookmarked = !this.item!.is_bookmarked;
        },
        error: () => {
          this._ToastService.add({
            severity: 'error',
            summary: 'general.error',
            detail: 'general.errorUpdatingFavoriteStatus',
            life: 5000,
          });
        }
      });
  }

  protected logCheckboxState(event: Event): void {
    event.stopPropagation();
    Logger.debug('PodcastCardForMeetingChatComponent => isTask: ', { isTask: this.isTask, item: this.item });
  }
}
