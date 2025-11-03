import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, EventEmitter, inject, Input, OnChanges, Output, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';
import { isBrowser, ModalService, StorageKeys, SvgIconComponent, ToastService } from '../../../../shared';
import { FavoritePodcastsFacade, PodcastsListFacade, ToggleFavoritePodcastFacade } from '../../services';
import { IGlobalPodcastItemModel, Logger, StorageService, TranslationsFacade } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PodcastDetailsComponent } from '../podcast-details';
import { PodcastDetailsHeaderConfig } from '../../configs';
import { RoleGuardService } from '../../../authentication';

@Component({
  selector: 'app-podcast-audio-player',
  standalone: true,
  imports: [
    CommonModule,

    SvgIconComponent,

    LazyLoadImageDirective
  ],
  templateUrl: './podcast-audio-player.component.html',
  styleUrls: ['./podcast-audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastAudioPlayerComponent implements OnChanges {

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

  private readonly _modalService = inject(ModalService);
  private readonly _PodcastsListFacade = inject(PodcastsListFacade);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _ToastService = inject(ToastService);

  @Input() podcastDetails!: IGlobalPodcastItemModel;
  @Input() currentTime!: number;
  @Input() isloadingFavourite: boolean = false;
  @Input() isFullScreenFromAudio: boolean = false;

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLDivElement>;

  protected isPlaying: boolean = false;
  protected volume: number = 1;
  protected progress: number = 0;
  protected isLoading: boolean = true;
  protected isEnded: boolean = false;
  protected isRepeatOne: boolean = false;
  protected volumeLevel = 1;
  protected currentAudioTime: number = 0;

  @Input() externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);
  @Output() public favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();
  protected readonly _ToggleFavoritePodcastFacade = inject(ToggleFavoritePodcastFacade);
  protected isToggleLoading = computed(() => {
    return this.podcastDetails && this._ToggleFavoritePodcastFacade.loadingPodcastIds().has(this.podcastDetails.id);
  });
  private readonly favouritePodcastFacade = inject(FavoritePodcastsFacade);

  private timeUpdateHandler = () => {
    const audio = this.audioPlayerRef.nativeElement;
    const currentTime = audio.currentTime;
    this.currentAudioTime = currentTime;
    const duration = audio.duration;
    const calculatedProgress = (currentTime / duration) * 100;
    this.progress = isNaN(calculatedProgress) ? 0 : calculatedProgress;
    this._changeDetectorRef.detectChanges();
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser) return;

    if (changes['currentTime'] && changes['currentTime'].currentValue && this.audioPlayerRef?.nativeElement) {
      const audio = this.audioPlayerRef.nativeElement;
      const newTime = changes['currentTime'].currentValue;

      if (!isNaN(newTime) && newTime > 0) {
        console.log('Setting audio time to:', newTime);
        audio.currentTime = newTime;
        this.currentAudioTime = newTime;

        if (audio.paused) {
          audio.play().then(() => {
            console.log('Audio started playing from time:', newTime);
            this.isPlaying = true;
            this._changeDetectorRef.detectChanges();
          }).catch((error) => {
            console.error('Error playing audio:', error);
            this.handlePlayError(error);
          });
        }

        this._changeDetectorRef.detectChanges();
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const audio = this.audioPlayerRef.nativeElement;
    audio.volume = this.volume;

    audio.addEventListener('timeupdate', this.timeUpdateHandler);

    audio.addEventListener('error', (e) => {
      this.handleAudioError(e);
    });

    if (this.currentTime && !isNaN(this.currentTime) && this.currentTime > 0) {
      console.log('ngAfterViewInit: Setting initial time to:', this.currentTime);
      audio.currentTime = this.currentTime;
      this.currentAudioTime = this.currentTime;
      audio.play().catch((error) => {
        this.handlePlayError(error);
      });
      this.isPlaying = true;
      this._changeDetectorRef.detectChanges();
    }

    audio.addEventListener('ended', () => {
      this.isEnded = true;
      this.isPlaying = false;
      if (this.isRepeatOne) {
        audio.play().catch((error) => {
          this.handlePlayError(error);
        });
        this.isPlaying = true;

      }
      this._changeDetectorRef.detectChanges();
    });
  }
  protected toggleRepeat(): void {
    this.isRepeatOne = !this.isRepeatOne;
    console.log('Repeat One:', this.isRepeatOne);
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    const audio = this.audioPlayerRef.nativeElement;
    audio.removeEventListener('timeupdate', this.timeUpdateHandler);
  }

  protected seek(event: MouseEvent): void {
    if (!this.isBrowser) return;

    const progressBar = this.progressBarRef.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const audio = this.audioPlayerRef.nativeElement;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
    this._changeDetectorRef.detectChanges();
  }

  protected togglePlayPause(): void {
    if (!this.isBrowser) return;

    const audio = this.audioPlayerRef.nativeElement;
    if (audio.paused) {
      audio.play().catch((error) => {
        this.handlePlayError(error);
      });
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
    this.isEnded = false;
    this._changeDetectorRef.detectChanges();
  }

  protected forward(): void {
    if (!this.isBrowser) return;
    const audio = this.audioPlayerRef.nativeElement;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    this._changeDetectorRef.detectChanges();
  }

  protected rewind(): void {
    if (!this.isBrowser) return;
    const audio = this.audioPlayerRef.nativeElement;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    this._changeDetectorRef.detectChanges();
  }

  protected changeVolume(): void {
    if (!this.isBrowser) return;
    const audio = this.audioPlayerRef.nativeElement;
    audio.volume = this.volume;
    this._changeDetectorRef.detectChanges();
  }

  protected toggleMute(): void {
    if (!this.isBrowser) return;
    const audio = this.audioPlayerRef.nativeElement;
    if (audio.volume > 0) {
      this.volume = 0;
      audio.volume = 0;
    } else {
      this.volume = 1;
      audio.volume = 1;
    }
    this._changeDetectorRef.detectChanges();
  }

  protected closeAudioPlayer(): void {
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: false,
      item: null
    });
  }

  get isMuted() {
    return this.volumeLevel === 0;
  }

  get isHalfVolume() {
    return this.volumeLevel === 0.5;
  }

  protected toggleVolume(): void {
    if (this.volumeLevel === 1) {
      this.volumeLevel = 0.5;
    } else if (this.volumeLevel === 0.5) {
      this.volumeLevel = 0;
    } else {
      this.volumeLevel = 1;
    }

    const audio: HTMLAudioElement | null = document.querySelector('audio');
    if (audio) {
      audio.volume = this.volumeLevel;
    }
    this._changeDetectorRef.detectChanges();
  }

  protected maximizePodcast(): void {
    this.openPodcastDetailsModal();
  }

  protected onFullScreen(): void {
    this.openPodcastDetailsModal(true);
  }

  protected handleFavouriteToggle(event: Event): void {
    event.stopPropagation();

    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    if (!this.podcastDetails || this.isToggleLoading()) {
      Logger.debug('Attempted to toggle favorite on invalid podcastDetails or while already loading.');
      return;
    }

    Logger.debug('Toggling favorite status for podcast ID:', this.podcastDetails.id);

    this._ToggleFavoritePodcastFacade.togglePodcastFavorite(this.podcastDetails.id)
      .subscribe({
        next: () => {
          Logger.debug(`Favorite toggle for podcast ${this.podcastDetails?.id} request completed.`);
          this.favouriteToggled.emit(this.podcastDetails!);
          this.podcastDetails!.is_bookmarked = !this.podcastDetails!.is_bookmarked;
          this.favouritePodcastFacade.fetchFavorites();
          this._changeDetectorRef.detectChanges();
        },
        error: () => {
          this._ToastService.add({
            severity: 'error',
            summary: 'an_error_has_occurred',
            detail: 'an_error_has_occurredUpdatingFavoriteStatus',
            life: 5000,
          });
          this._changeDetectorRef.detectChanges();
        }
      });
  }

  protected openPodcastDetailsModal(isFullScreenFromAudio: boolean = false): void {
    this.closeAudioPlayer();
    let modalInputs: any = {};
    let modalOutputs: any = {};

    modalInputs = {
      ...PodcastDetailsHeaderConfig,
      item: this.podcastDetails,
      currentTime: this.currentAudioTime
    };
    if (isFullScreenFromAudio) {
      modalInputs.isFullScreenFromAudio = true;
    }
    modalOutputs = {
      closed: () => {
        Logger.debug('Podcast Details modal closed.');
      },
    };

    this._modalService.open(PodcastDetailsComponent, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: '70%',
      height: '78vh'
    });
  }

  private handleAudioError(error: any): void {
    Logger.error('Audio error:', error);
    const audio = this.audioPlayerRef?.nativeElement;
    let errorMessage = 'audio_file_decryption_error';

    if (audio?.error) {
      if (audio.error.code) {

        errorMessage = 'audio_file_decryption_error';

      }
    }

    this._ToastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: this.translate(errorMessage),
      life: 5000,
    });

    this.isPlaying = false;
    this._changeDetectorRef.detectChanges();
  }

  private handlePlayError(error: any): void {
    Logger.error('Play error:', error);
    let errorMessage = 'audio_file_decryption_error';

    if (error.name === 'NotSupportedError') {
      errorMessage = 'audio_file_decryption_error';
    } else if (error.name === 'NotAllowedError') {
      errorMessage = 'audio_file_decryption_error';
    } else if (error.name === 'AbortError') {
      errorMessage = 'audio_file_decryption_error';
    }

    this._ToastService.add({
      severity: 'error',
      summary: 'an_error_has_occurred',
      detail: this.translate(errorMessage),
      life: 5000,
    });
    this.isPlaying = false;
    this._changeDetectorRef.detectChanges();
  }
  private translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
}