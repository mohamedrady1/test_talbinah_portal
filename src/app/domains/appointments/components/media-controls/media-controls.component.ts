import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LocalizationService, SvgIconComponent } from '../../../../shared';
import { AgoraRtcService, Logger } from '../../../../common';

@Component({
  selector: 'app-media-controls',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './media-controls.component.html',
  styleUrls: ['./media-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaControlsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('micButton') micButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('videoButton') videoButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('screenButton') screenButton?: ElementRef<HTMLButtonElement>;

  @Output() expandChat = new EventEmitter<void>();
  @Output() expandChatLarge = new EventEmitter<void>();

  private readonly agoraRtc = inject(AgoraRtcService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localizationService = inject(LocalizationService);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  protected isFullscreen = false;
  protected audioVolume = 100;

  // Signals from Agora service
  protected readonly micMuted = this.agoraRtc.audioMuted;
  protected readonly videoMuted = this.agoraRtc.videoMuted;
  protected readonly screenSharing = this.agoraRtc.screenSharing;
  protected readonly hasAudioPermission = this.agoraRtc.hasAudioPermission;
  protected readonly hasVideoPermission = this.agoraRtc.hasVideoPermission;
  protected readonly hasScreenSharePermission = this.agoraRtc.hasScreenSharePermission;

  // Computed direction based on language
  protected readonly fillDirection = this.localizationService.getCurrentLanguage() === 'ar' ? 'left' : 'right';

  private fullscreenChangeListeners: (() => void)[] = [];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.setupFullscreenListeners();
    this.initializeVolumeSlider();
  }

  ngOnDestroy(): void {
    this.cleanupFullscreenListeners();
  }

  private setupFullscreenListeners(): void {
    const handler = () => this.updateFullscreenState();

    const events = [
      { name: 'fullscreenchange', handler },
      { name: 'webkitfullscreenchange', handler },
      { name: 'mozfullscreenchange', handler },
      { name: 'MSFullscreenChange', handler }
    ];

    events.forEach(event => {
      document.addEventListener(event.name, event.handler);
      this.fullscreenChangeListeners.push(
        () => document.removeEventListener(event.name, event.handler)
      );
    });

    this.updateFullscreenState();
  }

  private cleanupFullscreenListeners(): void {
    this.fullscreenChangeListeners.forEach(removeListener => removeListener());
    this.fullscreenChangeListeners = [];
  }

  private updateFullscreenState(): void {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }

  private initializeVolumeSlider(): void {
    const volumeSlider = document.querySelector<HTMLInputElement>('.volume-slider');
    if (volumeSlider) {
      volumeSlider.style.setProperty('--progress', `${this.audioVolume}%`);
    }
  }

  protected toggleFullScreen(): void {
    if (!this.isBrowser) return;

    const agoraChat = document.querySelector('.agora-chat') as HTMLElement;
    if (!agoraChat) return;

    if (this.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen(agoraChat);
    }
  }

  private async enterFullscreen(element: HTMLElement): Promise<void> {
    try {
      await (element.requestFullscreen?.() ||
        (element as any).webkitRequestFullscreen?.() ||
        (element as any).msRequestFullscreen?.() ||
        (element as any).mozRequestFullScreen?.());
    } catch (error) {
      Logger.error('Failed to enter fullscreen:', error);
    }
  }

  private async exitFullscreen(): Promise<void> {
    try {
      await (document.exitFullscreen?.() ||
        (document as any).webkitExitFullscreen?.() ||
        (document as any).msExitFullscreen?.() ||
        (document as any).mozCancelFullScreen?.());
    } catch (error) {
      Logger.error('Failed to exit fullscreen:', error);
    }
  }

  // Other control methods remain the same
  async handleMicToggle(): Promise<void> {
    if (!this.isBrowser || !this.hasAudioPermission()) return;
    await this.agoraRtc.toggleAudio();
    this.audioVolume = this.micMuted() ? 0 : 100;
  }

  async handleVideoToggle(): Promise<void> {
    if (!this.isBrowser || !this.hasVideoPermission()) return;
    await this.agoraRtc.toggleVideo();
  }

  async handleScreenShareToggle(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      await this.agoraRtc.toggleScreenShare();
    } catch (error) {
      Logger.error('Failed to toggle screen sharing:', error);
    }
  }

  async handleLeaveChannel(): Promise<void> {
    if (!this.isBrowser) return;
    await this.agoraRtc.leaveChannel();
    this.expandChatLarge.emit();
  }

  protected openChatOnly(): void {
    this.expandChat.emit();
  }

  protected openChatLarge(): void {
    this.expandChatLarge.emit();
  }

  async handleVolumeChange(event: Event, input: HTMLInputElement): Promise<void> {
    if (!this.isBrowser || !this.hasAudioPermission()) return;
    const value = parseInt(input.value, 10);
    this.audioVolume = value;
    input.style.setProperty('--progress', `${value}%`);
    await this.agoraRtc.setAudioVolume(value);
  }
}
