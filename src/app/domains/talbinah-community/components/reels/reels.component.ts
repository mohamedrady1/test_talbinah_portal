import { Component, Input, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, SimpleChanges, Output, EventEmitter, PLATFORM_ID, Inject, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MediaType, Reel } from '../../models';
import { ReelActionsComponent } from '../reel-actions';
import { ShareSocialComponent } from '../../../../shared';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-reels',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReelActionsComponent, ShareSocialComponent],
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
})
export class ReelsComponent implements AfterViewInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input() reels: Reel[] = [];
  @Input() isActive: boolean = false;

  @Output() cardReelsFinished = new EventEmitter<void>();

  currentReelIndex = signal(0);
  isInternalPlaying = signal(true); // Default to playing when active
  isMuted = signal(false);
  currentProgress = signal(0);
  isPressingLeft = signal(false);
  isPressingRight = signal(false);
  controlsVisible = signal(true);
  imageElapsedTime = signal(0);

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

  private imageTimer: any;
  private intervalUpdater: any;
  private longPressTimeout: any;
  private controlsTimeout: any;
  private isBrowser: boolean;

  private readonly LONG_PRESS_THRESHOLD_MS = 500;
  private readonly CONTROLS_HIDE_DELAY_MS = 10000;

  currentReel = computed(() => this.reels[this.currentReelIndex()]);

  MediaType = MediaType;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      if (this.isActive) {
        // If this component becomes active, start playback if it was meant to play
        // and reset if coming from an inactive state to ensure fresh start
        if (this.isInternalPlaying()) { // Only start if internally set to play
          this.startPlayback();
        }
      } else {
        // If this component becomes inactive, pause playback immediately
        this.pausePlayback();
        // Reset to the first reel and clear progress for the next time it becomes active
        this.currentReelIndex.set(0);
        this.imageElapsedTime.set(0);
        this.currentProgress.set(0);
        if (this.isBrowser) { // Access DOM only in browser
          const videoElement = this.videoPlayerRef?.nativeElement;
          if (videoElement) {
            videoElement.currentTime = 0; // Reset video to beginning
            videoElement.pause(); // Ensure video is explicitly paused
          }
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) { // Execute DOM-related logic only in browser
      setTimeout(() => {
        this.imageElapsedTime.set(0);
        if (this.isActive && this.isInternalPlaying()) {
          this.startPlayback();
        } else {
          this.pausePlayback();
        }
        this.resetControlsTimer();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.clearLongPressTimers();
    this.clearControlsTimer();
  }

  private clearTimers(): void {
    if (this.imageTimer) {
      clearTimeout(this.imageTimer);
      this.imageTimer = null;
    }
    if (this.intervalUpdater) {
      clearInterval(this.intervalUpdater);
      this.intervalUpdater = null;
    }
  }

  private clearLongPressTimers(): void {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
  }

  private clearControlsTimer(): void {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
  }

  resetControlsTimer(): void {
    if (!this.isBrowser) return; // Only relevant in browser

    this.clearControlsTimer();
    this.controlsVisible.set(true);
    this.controlsTimeout = setTimeout(() => {
      this.controlsVisible.set(false);
    }, this.CONTROLS_HIDE_DELAY_MS);
  }

  startPlayback(): void {
    if (!this.isActive || !this.isInternalPlaying()) {
      return;
    }

    this.clearTimers();

    const reel = this.currentReel();
    if (!reel) return;

    if (reel.mediaType === MediaType.Video) {
      if (!this.isBrowser) return; // Video playback only in browser

      const videoElement = this.videoPlayerRef?.nativeElement;
      if (videoElement) {
        videoElement.muted = this.isMuted();
        videoElement.playbackRate = (this.isPressingLeft() || this.isPressingRight()) ? 2 : 1;

        videoElement.play().catch(error => {
          console.error('Video autoplay failed:', error);
          this.isInternalPlaying.set(false);
          this.controlsVisible.set(true);
        });

        this.intervalUpdater = setInterval(() => {
          if (videoElement.duration > 0) {
            this.currentProgress.set((videoElement.currentTime / videoElement.duration) * 100);
          }
        }, 50);
      }
    } else if (reel.mediaType === MediaType.Image) {
      const duration = reel.duration || 5;
      const remainingDuration = (duration * 1000) - this.imageElapsedTime();

      if (remainingDuration <= 0) {
        this.nextReel();
        return;
      }

      this.imageTimer = setTimeout(() => {
        this.nextReel();
      }, remainingDuration);

      let elapsed = this.imageElapsedTime();
      this.intervalUpdater = setInterval(() => {
        elapsed += 50;
        this.currentProgress.set((elapsed / (duration * 1000)) * 100);
        if (elapsed >= (duration * 1000)) {
          clearInterval(this.intervalUpdater);
        }
      }, 50);
    }
  }

  pausePlayback(): void {
    this.clearTimers();
    this.resetPlaybackSpeed();

    const reel = this.currentReel();
    if (reel) {
      if (reel.mediaType === MediaType.Video) {
        if (!this.isBrowser) return; // Video control only in browser
        const videoElement = this.videoPlayerRef?.nativeElement;
        if (videoElement) {
          videoElement.pause();
        }
      } else if (reel.mediaType === MediaType.Image) {
        const duration = reel.duration || 5;
        this.imageElapsedTime.set((this.currentProgress() / 100) * duration * 1000);
      }
    }
  }

  togglePlayPause(): void {
    this.isInternalPlaying.update(val => !val);
    if (this.isInternalPlaying()) {
      this.startPlayback();
    } else {
      this.pausePlayback();
    }
    this.resetControlsTimer();
  }

  toggleMuteUnmute(): void {
    this.isMuted.update(val => !val);
    if (this.isBrowser) { // Video control only in browser
      const videoElement = this.videoPlayerRef?.nativeElement;
      if (videoElement) {
        videoElement.muted = this.isMuted();
      }
    }
    this.resetControlsTimer();
  }

  onVideoEnded(): void {
    if (this.currentReelIndex() < this.reels.length - 1) {
      this.nextReel();
    } else {
      this.cardReelsFinished.emit();
    }
  }

  goToReel(index: number): void {
    if (index >= 0 && index < this.reels.length) {
      this.currentReelIndex.set(index);
      this.imageElapsedTime.set(0);
      this.currentProgress.set(0);
      if (this.isBrowser) { // Video control only in browser
        const videoElement = this.videoPlayerRef?.nativeElement;
        if (videoElement) {
          videoElement.currentTime = 0;
        }
      }
      this.startPlayback();
      this.resetControlsTimer();
    }
  }

  nextReel(): void {
    if (this.currentReelIndex() < this.reels.length - 1) {
      this.currentReelIndex.update(index => index + 1);
      this.imageElapsedTime.set(0);
      this.currentProgress.set(0);
      if (this.isBrowser) { // Video control only in browser
        const videoElement = this.videoPlayerRef?.nativeElement;
        if (videoElement) {
          videoElement.currentTime = 0;
        }
      }
      this.startPlayback();
    } else {
      this.cardReelsFinished.emit();
    }
    this.resetControlsTimer();
  }

  prevReel(): void {
    if (this.currentReelIndex() > 0) {
      this.currentReelIndex.update(index => index - 1);
      this.imageElapsedTime.set(0);
      this.currentProgress.set(0);
      if (this.isBrowser) { // Video control only in browser
        const videoElement = this.videoPlayerRef?.nativeElement;
        if (videoElement) {
          videoElement.currentTime = 0;
        }
      }
      this.startPlayback();
    }
    this.resetControlsTimer();
  }

  onLeftClick(): void {
    if (!(this.isPressingLeft() || this.isPressingRight())) {
      this.prevReel();
    }
    this.resetControlsTimer();
  }

  onRightClick(): void {
    if (!(this.isPressingLeft() || this.isPressingRight())) {
      this.nextReel();
    }
    this.resetControlsTimer();
  }

  onAreaMouseDown(side: 'left' | 'right'): void {
    this.clearLongPressTimers();
    this.resetControlsTimer();

    if (side === 'left') {
      this.isPressingLeft.set(true);
    } else {
      this.isPressingRight.set(true);
    }

    this.longPressTimeout = setTimeout(() => {
      const reel = this.currentReel();
      if (reel && reel.mediaType === MediaType.Video) {
        if (this.isBrowser) { // Video control only in browser
          const videoElement = this.videoPlayerRef?.nativeElement;
          if (videoElement) {
            videoElement.playbackRate = 2;
          }
        }
      }
    }, this.LONG_PRESS_THRESHOLD_MS);
  }

  onAreaMouseUp(): void {
    this.clearLongPressTimers();
    this.resetPlaybackSpeed();
    this.isPressingLeft.set(false);
    this.isPressingRight.set(false);
    this.resetControlsTimer();
  }

  onAreaMouseLeave(): void {
    this.clearLongPressTimers();
    this.resetPlaybackSpeed();
    this.isPressingLeft.set(false);
    this.isPressingRight.set(false);
    this.resetControlsTimer();
  }

  private resetPlaybackSpeed(): void {
    const reel = this.currentReel();
    if (reel && reel.mediaType === MediaType.Video) {
      if (this.isBrowser) { // Video control only in browser
        const videoElement = this.videoPlayerRef?.nativeElement;
        if (videoElement) {
          videoElement.playbackRate = 1;
        }
      }
    }
  }

  onTimeUpdate(event: Event): void {
    if (!this.isBrowser) return; // Event only fires in browser

    const videoElement = event.target as HTMLVideoElement;
    if (videoElement.duration > 0) {
      this.currentProgress.set((videoElement.currentTime / videoElement.duration) * 100);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isActive || !this.isBrowser) { // Keyboard events only in browser
      return;
    }

    this.resetControlsTimer();

    switch (event.key) {
      case 'ArrowRight':
        this.nextReel();
        break;
      case 'ArrowLeft':
        this.prevReel();
        break;
      case 'm':
      case 'M':
        this.toggleMuteUnmute();
        break;
      case ' ':
        event.preventDefault();
        this.togglePlayPause();
        break;
    }
  }
}