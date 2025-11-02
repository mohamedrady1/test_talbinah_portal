import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  signal,
  WritableSignal,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  computed,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SvgIconComponent, ModalService, getAvatarBackgroundColor, generateInitials, ToastService, LocalizationService } from '../../../../shared';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MediaControlsComponent } from '../media-controls';
import { RemoteStreamComponent } from "../remote-stream";
import { Meta, Title } from '@angular/platform-browser';
import { IGlobalReservationModel } from '../../models';
import { AgoraRtcService, Logger } from '../../../../common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-voice-video-agora-chat',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    TranslateModule,
    MediaControlsComponent,
    RemoteStreamComponent
  ],
  templateUrl: './voice-video-agora-chat.component.html',
  styleUrls: ['./voice-video-agora-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceVideoAgoraChatComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentReservationData: IGlobalReservationModel | null = null;
  @Output() expandChatPanel = new EventEmitter<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  protected readonly agora = inject(AgoraRtcService);
  private readonly toast = inject(ToastService);
  private readonly localization = inject(LocalizationService);
  private readonly destroy$ = new Subject<void>();

  private CHANNEL_NAME!: string;

  protected isJoined: WritableSignal<boolean> = this.agora.isJoined;
  protected isVoiceMuted = signal(false);
  protected isVideoMuted = signal(false);
  protected localVideoActive = computed(() => !this.agora.videoMuted());
  protected micMuted = computed(() => this.isVoiceMuted());
  protected callDuration = signal('00:00');
  protected isCallEnded = signal(false);
  protected remoteUsers = this.agora.remoteUsers;
  protected initFailed = signal(false);

  protected connectionQuality = computed(() => this.agora.getArabicQualityText());
  protected connectionStats = this.agora.connectionStats;

  @Input() remainingTimeInSeconds: number = 0;
  @ViewChild('videoElement') videoElementRef?: ElementRef<HTMLVideoElement>;

  private timerInterval?: ReturnType<typeof setInterval>;

  // Computed signals
  protected readonly userAvatarBackgroundColor = computed((name?: string | null) =>
    getAvatarBackgroundColor(this.currentReservationData?.user?.full_name ?? '')
  );

  protected readonly userInitials = computed((name?: string | null) =>
    generateInitials(this.currentReservationData?.user?.full_name ?? '')
  );

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.initializeComponent();
    this.setupMetadata();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentReservationData'] && !changes['currentReservationData'].firstChange) {
      this.resetAndReinitialize();
    }
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  private initializeComponent(): void {
    Logger.debug('[VoiceVideoAgoraChat] Component initialized with reservation:', this.currentReservationData);

    this.CHANNEL_NAME = this.currentReservationData?.id.toString() || 'Talbinah';

    if (this.currentReservationData?.remaining_time && this.currentReservationData.remaining_time > 0) {
      this.remainingTimeInSeconds = this.currentReservationData.remaining_time;
    }

    this.initAgora().catch(error => {
      Logger.error('[VoiceVideoAgoraChat] Failed to initialize Agora:', error);
    });
  }

  private setupMetadata(): void {
    this.title.setTitle('استشارة فيديو مباشرة');
    this.meta.updateTag({ name: 'description', content: 'انضم إلى جلسة فيديو مباشرة مع طبيبك.' });
  }

  private async initAgora(): Promise<void> {
    try {
      // Cleanup any existing session first
      await this.cleanupAgoraSession();

      // Initialize new session
      await this.agora.joinWithBackendToken(this.CHANNEL_NAME);
      await this.agora.startLocalPreview('local-stream');

      this.startCallTimer();
      Logger.debug('[VoiceVideoAgoraChat] Agora initialized and joined channel:', this.CHANNEL_NAME);
    } catch (err) {
      Logger.error('[VoiceVideoAgoraChat] Failed to init Agora:', err);
      const message = (err as any)?.message || this.localization.translateTextFromJson('general.error');
      this.toast.add({
        severity: 'error',
        summary: this.localization.translateTextFromJson('general.error'),
        detail: message,
        life: 5000
      })
      this.initFailed.set(true);
    }
  }

  private async cleanupAgoraSession(): Promise<void> {
    if (this.agora.isJoined()) {
      await this.agora.leaveChannel();
    }

    // Reset all related signals
    this.resetComponentState();
  }

  private resetComponentState(): void {
    this.isVoiceMuted.set(false);
    this.isVideoMuted.set(false);
    this.isCallEnded.set(false);
    this.callDuration.set('00:00');
    this.stopCallTimer();
  }

  private resetAndReinitialize(): void {
    this.cleanupResources()
      .then(() => this.initializeComponent())
      .catch(error => {
        Logger.error('[VoiceVideoAgoraChat] Error during reset and reinitialize:', error);
      });
  }

  private async cleanupResources(): Promise<void> {
    this.destroy$.next();
    this.destroy$.complete();

    await this.cleanupAgoraSession();
    this.stopCallTimer();
  }

  protected async leaveChannel(): Promise<void> {
    if (!this.isBrowser) return;
    await this.cleanupAgoraSession();
  }

  protected toggleAudio(): void {
    if (!this.isBrowser) return;
    this.isVoiceMuted.update((v) => !v);
    // Add actual Agora audio mute/unmute logic here if needed
  }

  protected toggleVideo(): void {
    if (!this.isBrowser) return;
    this.isVideoMuted.update((v) => !v);
    // Add actual Agora video mute/unmute logic here if needed
  }

  private startCallTimer(): void {
    let remaining = this.remainingTimeInSeconds ?? 0;
    this.updateCallDuration(remaining);

    this.timerInterval = setInterval(() => {
      remaining--;
      this.updateCallDuration(remaining);

      if (remaining <= 0) {
        this.stopCallTimer();
        this.isCallEnded.set(true);
        Logger.debug('Call ended automatically');
        this.leaveChannel().catch(error => {
          Logger.error('Error leaving channel after call end:', error);
        });
      }
    }, 1000);
  }

  private updateCallDuration(seconds: number): void {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      this.callDuration.set(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    } else {
      this.callDuration.set(
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    }
  }

  private stopCallTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  protected expandChat(): void {
    this.expandChatPanel.emit();
  }

  protected expandChatLarge(): void {
    this.expandChatPanel.emit();
  }
}
