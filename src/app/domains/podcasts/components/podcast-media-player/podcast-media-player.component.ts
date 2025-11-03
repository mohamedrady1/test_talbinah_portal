import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { FavoritePodcastsFacade, ToggleFavoritePodcastFacade } from '../../services';
import { IGlobalPodcastItemModel, Logger, StorageService } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LocalizationService, ModalService, StorageKeys, ToastService } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { RoleGuardService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-podcast-media-player',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    LazyLoadImageDirective,

  ],
  templateUrl: './podcast-media-player.component.html',
  styleUrls: ['./podcast-media-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastMediaPlayerComponent implements OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);

  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

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



  @Input() item!: IGlobalPodcastItemModel;
  @Input() isPhone: boolean = false;
  @Input() currentTime: number = 0;
  @Output() closed = new EventEmitter<boolean>();
  private localization = inject(LocalizationService);
  protected currentLanguage!: string;

  @Output() onMaximize: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onMinimize = new EventEmitter<number>();

  @ViewChild('audioRef') audioElementRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('volumeBar') volumeBarRef!: ElementRef<HTMLDivElement>;

  private readonly _ToastService = inject(ToastService);


  protected isPlaying = signal(false);
  protected isLoading = signal(false);
  protected isFullscreen = signal(false);

  protected currentTimeSignal = signal(0);
  protected duration = signal(0);
  protected progress = signal(0);
  protected volume = signal(1);
  protected previousVolume = signal(1);

  private loadingTimeout: any = null;

  @Input() externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);
  @Output() public favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();

  protected readonly _ToggleFavoritePodcastFacade = inject(ToggleFavoritePodcastFacade);
  protected isToggleLoading = computed(() => {
    return this.item && this._ToggleFavoritePodcastFacade.loadingPodcastIds().has(this.item.id);
  });
  private readonly favouritePodcastFacade = inject(FavoritePodcastsFacade);

  constructor() {
    effect(() => {
      const external = this.externalFavouriteToggled();
      if (external) {
        this.item = external;
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.localization.getCurrentLanguage();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      this.updateAudioVolume();

      console.log('PodcastMediaPlayerComponent.ngAfterViewInit - currentTime:', this.currentTime);

      // Check if audio source is valid
      if (!audio.src || audio.src === '') {
        Logger.error('Audio source is empty or invalid');
        this._ToastService.add({
          severity: 'error',
          summary: 'an_error_has_occurred',
          detail: this.translate('audio_file_decryption_error'),
          life: 5000,
        });
        this.isLoading.set(false);
        return;
      }

      // Error handler for audio element
      audio.addEventListener('error', (e) => {
        this.handleAudioError(e);
      });

      setTimeout(() => {
        if (this.currentTime && !isNaN(this.currentTime) && this.currentTime > 0) {
          console.log('Setting audio time to:', this.currentTime);
          audio.currentTime = this.currentTime;
          this.currentTimeSignal.set(this.currentTime);
          audio.play().catch((error) => {
            this.handlePlayError(error);
          });
          this.isPlaying.set(true);
        } else {
          console.log('No valid currentTime provided:', this.currentTime);
        }
      }, 100); // Increased timeout to ensure audio element is ready

      audio.addEventListener('waiting', () => {
        this.isLoading.set(true);
        this.startLoadingTimeout();
      });
      audio.addEventListener('canplay', () => {
        this.isLoading.set(false);
        this.clearLoadingTimeout();
        if (audio.duration && audio.duration !== Infinity && this.duration() === 0) {
          this.duration.set(audio.duration);
        }
      });
      audio.addEventListener('playing', () => {
        this.isPlaying.set(true);
        this.isLoading.set(false);
        this.clearLoadingTimeout();
      });
      audio.addEventListener('pause', () => this.isPlaying.set(false));
      audio.addEventListener('ended', () => {
        this.isPlaying.set(false);
        this.currentTimeSignal.set(0);
        this.progress.set(0);
      });
    }
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

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
          Logger.debug(`Favorite toggle for podcast ${this.item.id} request completed.`);
          this.favouriteToggled.emit(this.item);
          this.item.is_bookmarked = !this.item.is_bookmarked;
          this.favouritePodcastFacade.fetchFavorites();

        },
        error: () => {
          Logger.error(`Favorite toggle for podcast ${this.item.id} failed, reverting UI.`);
        }
      });
  }

  protected onMetadataLoaded(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      this.duration.set(audio.duration);
      this.progress.set((this.currentTimeSignal() / this.duration()) * 100 || 0);
    }
  }

  protected onTimeUpdate(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      this.currentTimeSignal.set(audio.currentTime);
      this.progress.set((audio.currentTime / audio.duration) * 100 || 0);
    }
  }

  protected togglePlay(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      if (this.isPlaying()) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          this.handlePlayError(error);
        });
      }
    }
  }

  protected skipForward(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  }

  protected skipBackward(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  }

  protected seek(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const progressBar = this.progressBarRef.nativeElement;
      const audio = this.audioElementRef.nativeElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      audio.currentTime = percentage * audio.duration;
    }
  }

  protected onVolumeChange(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const volumeBar = this.volumeBarRef.nativeElement;
      const audio = this.audioElementRef.nativeElement;
      const rect = volumeBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      let newVolume = clickX / rect.width;
      newVolume = Math.max(0, Math.min(1, newVolume));
      this.volume.set(newVolume);
      if (newVolume > 0) {
        this.previousVolume.set(newVolume);
      }
      this.updateAudioVolume();
    }
  }

  private updateAudioVolume(): void {
    if (isPlatformBrowser(this.platformId) && this.audioElementRef) {
      this.audioElementRef.nativeElement.volume = this.volume();
    }
  }

  protected toggleMute(): void {
    if (isPlatformBrowser(this.platformId)) {
      const audio = this.audioElementRef.nativeElement;
      if (this.volume() > 0) {
        this.previousVolume.set(this.volume());
        this.volume.set(0);
      } else {
        this.volume.set(this.previousVolume());
      }
      this.updateAudioVolume();
    }
  }

  protected formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  protected maximize(): void {
    this.isFullscreen.set(!this.isFullscreen());
    this.onMaximize.emit(true);
  }
  private readonly modalService = inject(ModalService);
  protected minimize(): void {
    this.isFullscreen.set(false);
    this.onMinimize.emit(this.currentTimeSignal());
    this.modalService.closeAll();
  }

  private handleAudioError(error: any): void {
    Logger.error('Audio error:', error);
    const audio = this.audioElementRef?.nativeElement;
    let errorMessage = 'audio_file_decryption_error';

    if (audio?.error) {
      errorMessage = 'audio_file_decryption_error';
    }

    this._ToastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: this.translate(errorMessage),
      life: 5000,
    });

    this.isPlaying.set(false);
    this.isLoading.set(false);
  }

  private handlePlayError(error: any): void {
    Logger.error('Play error:', error);
    let errorMessage = 'audio_file_decryption_error';
    this._ToastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: this.translate(errorMessage),
      life: 5000,
    });

    this.isPlaying.set(false);
    this.isLoading.set(false);
    this.clearLoadingTimeout();
  }

  private startLoadingTimeout(): void {
    this.clearLoadingTimeout();

    // Set timeout for 10 seconds
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading()) {
        Logger.error('Audio loading timeout - taking too long to load');
        this._ToastService.add({
          severity: 'error',
          summary: 'an_error_has_occurred',
          detail: this.translate('audio_file_decryption_error'),
          life: 5000,
        });
        this.isLoading.set(false);
        this.isPlaying.set(false);
      }
    }, 5000); // 10 seconds timeout
  }

  private clearLoadingTimeout(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();
  }
}

