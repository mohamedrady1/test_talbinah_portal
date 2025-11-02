import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  Input,
  ElementRef,
  ViewChild,
  HostListener,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-message-video',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './chat-message-video.component.html',
  styleUrls: ['./chat-message-video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageVideoComponent {
  @Input() videoUrl: string | null | any = null;
  @Input() replay: boolean = false;
  @ViewChild('playerContainer') playerContainer!: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  isPlaying = signal(false);
  isLoading = signal(true);
  volume = signal(1);
  previousVolume = signal(1);
  isMuted = signal(false);
  fullscreen = signal(false);
  progress = signal(0);
  currentTime = signal(0);
  duration = signal(0);
  hoverTime = signal(0);
  showTooltip = signal(false);
  tooltipX = signal(0);
  showRemaining = signal(false);
  buffered = signal(0);
  playbackSpeed = signal(1);
  hasStartedPlaying = signal(false);
  isEnded = signal(false);

  videoRef?: HTMLVideoElement;

  constructor() {
    if (this.isBrowser) {
      this.isLoading.set(true);
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onVideoLoadedMetadata(video: HTMLVideoElement) {
    if (!this.isBrowser) return;
    this.videoRef = video;
    this.duration.set(video.duration);
    this.isLoading.set(false);
    this.videoRef.addEventListener('ended', () => this.onVideoEnded());
  }

  onVideoEnded() {
    this.isPlaying.set(false);
    this.isEnded.set(true);
    this.hasStartedPlaying.set(false);
  }

  togglePlay() {
    if (!this.isBrowser || !this.videoRef) return;
    if (this.videoRef.paused || this.isEnded()) {
      this.videoRef.play();
      this.isPlaying.set(true);
      this.hasStartedPlaying.set(true);
      this.isEnded.set(false);
    } else {
      this.videoRef.pause();
      this.isPlaying.set(false);
    }
  }

  onTimeUpdate() {
    if (!this.isBrowser || !this.videoRef) return;
    this.currentTime.set(this.videoRef.currentTime);
    this.progress.set((this.videoRef.currentTime / this.videoRef.duration) * 100);

    const bufferedRanges = this.videoRef.buffered;
    if (bufferedRanges.length) {
      const end = bufferedRanges.end(bufferedRanges.length - 1);
      const percent = (end / this.videoRef.duration) * 100;
      this.buffered.set(percent);
    }
  }

  onVolumeChange(event: Event) {
    if (!this.isBrowser || !this.videoRef) return;
    const newVolume = parseFloat((event.target as HTMLInputElement).value);
    this.videoRef.volume = newVolume;
    this.volume.set(newVolume);
    this.isMuted.set(newVolume === 0);
  }

  toggleMute() {
    if (!this.isBrowser || !this.videoRef) return;
    if (this.isMuted()) {
      this.videoRef.volume = this.previousVolume();
      this.volume.set(this.previousVolume());
      this.isMuted.set(false);
    } else {
      this.previousVolume.set(this.volume());
      this.videoRef.volume = 0;
      this.volume.set(0);
      this.isMuted.set(true);
    }
  }

  toggleFullscreen() {
    if (!this.isBrowser) return;
    const element = this.playerContainer?.nativeElement;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.().then(() => this.fullscreen.set(true));
    } else {
      document.exitFullscreen?.().then(() => this.fullscreen.set(false));
    }
  }

  toggleTimeView() {
    this.showRemaining.set(!this.showRemaining());
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser || !this.videoRef) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.tooltipX.set(event.clientX - rect.left);
    this.hoverTime.set(percent * this.videoRef.duration);
  }

  onHoverStart() {
    this.showTooltip.set(true);
  }

  onHoverEnd() {
    this.showTooltip.set(false);
  }

  seek(event: MouseEvent) {
    if (!this.isBrowser || !this.videoRef) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.videoRef.currentTime = percent * this.videoRef.duration;
  }

  setPlaybackSpeed(event: Event) {
    if (!this.isBrowser || !this.videoRef) return;
    const newSpeed = parseFloat((event.target as HTMLSelectElement).value);
    this.videoRef.playbackRate = newSpeed;
    this.playbackSpeed.set(newSpeed);
  }

  togglePictureInPicture() {
    if (!this.isBrowser || !this.videoRef) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      this.videoRef.requestPictureInPicture?.();
    }
  }

  skip(seconds: number) {
    if (!this.isBrowser || !this.videoRef) return;
    this.videoRef.currentTime += seconds;
    this.isEnded.set(false);
  }

  downloadVideoInNewTab() {
    if (!this.isBrowser || !this.videoUrl) return;
    window.open(this.videoUrl, '_blank');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    if (!this.isBrowser || !this.videoRef) return;
    const isFocused = this.playerContainer?.nativeElement.contains(document.activeElement);
    if (!isFocused) return;

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        this.skip(-10);
        break;
      case 'ArrowRight':
        this.skip(10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.videoRef.volume = Math.min(1, this.videoRef.volume + 0.1);
        this.volume.set(this.videoRef.volume);
        this.isMuted.set(this.videoRef.volume === 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.videoRef.volume = Math.max(0, this.videoRef.volume - 0.1);
        this.volume.set(this.videoRef.volume);
        this.isMuted.set(this.videoRef.volume === 0);
        break;
      case 'f':
      case 'F':
        this.toggleFullscreen();
        break;
      case 'm':
      case 'M':
        this.toggleMute();
        break;
    }
  }
}
