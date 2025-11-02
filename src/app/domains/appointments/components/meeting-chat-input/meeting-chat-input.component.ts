import {
  ChangeDetectionStrategy,
  HostListener,
  PLATFORM_ID,
  DestroyRef,
  Component,
  ViewChild,
  computed,
  inject,
  signal,
  effect,
  ElementRef,
  Input,
  input,
  Output,
  EventEmitter
} from '@angular/core';
import { UploadAttachmentsMenuSelectorComponent } from '../upload-attachments-menu-selector';
import { IGlobalPodcastItemModel, Logger } from '../../../../common';
import { ConversationFacade } from '../../../talbinah-bot/services';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { getPointerY, pad } from '../../utils';
import { IUploadedFileMetadata, UploadAttachmentsFacade } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService, SvgIconComponent, ToastService } from '../../../../shared';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FileAttachment, IGlobalReservationModel } from '../../models';
import { FirestoreService } from '../../../../common/core/services/firestore.service';
import { MeetingChatItemTypes } from '../../enums';
import { IMeetingChatItem, ISendMeetingChatItem } from '../../dtos';
import { VoiceRecorderButtonComponent } from '../voice-recorder-button';

const LOCK_THRESHOLD_PX = 50;
const MAX_MESSAGE_LENGTH = 200000;

@Component({
  selector: 'app-meeting-chat-input',
  standalone: true,
  imports: [
    UploadAttachmentsMenuSelectorComponent,
    SvgIconComponent,
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule,
    VoiceRecorderButtonComponent
  ],
  templateUrl: './meeting-chat-input.component.html',
  styleUrls: ['./meeting-chat-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingChatInputComponent {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _activatedRoute = inject(ActivatedRoute); // Add this injection
  readonly reservationId = signal<number | null>(null);

  // @Input({ required: false }) replyingToMessageContent!: IMeetingChatItem | any | null;
  replyingToMessageContent = input<IMeetingChatItem | any | null>(null);
  @Output() replyingMessageChanged = new EventEmitter<IMeetingChatItem | null>();

  @Input() currentReservation: IGlobalReservationModel | null = null;
  @Input() doctorId: string | number | null = null;
  @Input() userId: string | number | null = null;

  private readonly _FirestoreService = inject(FirestoreService);

  private readonly _conversation = inject(ConversationFacade);

  private readonly _uploads = inject(UploadAttachmentsFacade);
  readonly isUploading = this._uploads.isUploading;
  readonly uploadError = this._uploads.uploadError;
  readonly uploadResponse = this._uploads.uploadedFilesResponse;
  readonly uploadedFilesMetadata = this._uploads.uploadedFilesMetadata;

  private readonly _toastService = inject(ToastService);
  private readonly _localizationService = inject(LocalizationService);

  @ViewChild('uploadAttachmentsMenuSelectorRef')
  private attachmentMenu!: UploadAttachmentsMenuSelectorComponent;

  @ViewChild('playbackAudio') playbackAudioRef!: ElementRef<HTMLAudioElement>;
  protected recordedAudioUrl: string | null = null;
  protected isPlayingBack: boolean = false;
  protected playbackTime: string = '00:00';
  private playbackTimer: any = null;

  readonly isMessageSending = this._conversation.isMessageSending;
  readonly message = signal('');
  readonly selectedFiles = signal<FileAttachment[]>([]);
  readonly isRecordingVoice = signal(false);
  readonly isVoiceLocked = signal(false);
  readonly recordingTime = signal('00:00');
  readonly showAttachmentMenu = signal(false);
  protected isCancelActive: boolean = false;
  protected isVoicePaused: boolean = false;
  private _pausedElapsed: number = 0;

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;

  private recordingStart = 0;
  private recordingInterval: ReturnType<typeof setInterval> | null = null;
  private startY: number | null = null;

  readonly reservation = computed(() => ({
    doctor: { id: this.doctorId ?? '' },
    user: { id: this.userId ?? '' }
  }));

  constructor() {
    this.setupUploadFilesEffect();
    this.setupMessageSendingEffect();

    if (isPlatformBrowser(this._platformId)) {
      this.reservationId.set(Number(this._activatedRoute.snapshot.paramMap.get('id')));
    } else {
      // For SSR, the snapshot is directly available
      this.reservationId.set(Number(this._activatedRoute.snapshot.paramMap.get('id')));
    }

    this._destroyRef.onDestroy(() => this.detachGlobalListeners());
  }

  private setupUploadFilesEffect(): void {
    effect(() => {
      const uploadedFiles = this.uploadedFilesMetadata();
      Logger.debug('[MeetingChatInputComponent] Upload state', {
        loading: this.isUploading(),
        error: this.uploadError(),
        response: this.uploadResponse(),
        uploadedFiles,
      });

      if (!uploadedFiles?.length) {
        return;
      }

      uploadedFiles.forEach(file => this.handleUploadedFile(file));
    });
  }
  // Handles a single uploaded file based on its type.
  private handleUploadedFile(file: IUploadedFileMetadata): void {
    if (!file) return;

    const commonPayload = {
      senderId: this.userId?.toString() ?? '',
      message: file.link ?? '',
      fileSize: file.size,
      fileName: file.name,
      replyReference: this.replyingToMessageContent() ?? null,
    };

    switch (file.type) {
      case MeetingChatItemTypes.FILE:
      case MeetingChatItemTypes.VIEW_PDF:
      case MeetingChatItemTypes.VIEW_PDF_ALT:
      case MeetingChatItemTypes.DOCUMENT:
      case MeetingChatItemTypes.IMAGE:
        this.sendChatMessage({ ...commonPayload, msgType: file.type });
        break;

      case MeetingChatItemTypes.VIDEO:
        this.sendChatMessage({
          ...commonPayload,
          msgType: file.type,
          thumbnailVideoImage: file.thumbnailVideoImage ?? '',
          videoDuration: (file.videoDuration ?? 0).toString(),
        });
        break;

      case MeetingChatItemTypes.AUDIO:
        this.sendChatMessage({
          ...commonPayload,
          msgType: file.type,
          recorderTimer: file.recorderTimer ?? null,
        });
        break;

      default:
        Logger.warn('[MeetingChatInputComponent] Unhandled file type:', file.type);
    }
  }
  // Sends a chat message via Firestore service.
  private sendChatMessage(payload: Omit<ISendMeetingChatItem, 'id' | 'messageTime' | 'isRead' | 'isMessageOpened'>): void {
    this._FirestoreService.sendMessage(this.reservation(), payload, this.currentReservation);
  }

  private setupMessageSendingEffect(): void {
    effect(() => {
      if (!this.isMessageSending() && this._conversation.lastBotStatus()) {
        this.resetInput();
      }
    });
  }

  // Reset Upload Facade When Needed
  private resetInput(): void {
    this.message.set('');
    this.clearFiles();
    this.stopVoiceRecording();
    this._uploads.resetState(); // Reset upload state
  }

  readonly isSendDisabled = computed(() =>
    this.isMessageSending() ||
    (!this.message().trim() && !this.selectedFiles().length && !this.isRecordingVoice())
  );

  protected sendMessage = async (evt: Event) => {
    evt.preventDefault();

    if (this.isRecordingVoice() && this.isVoiceLocked()) {
      await this.finalizeVoiceRecordingAndSend();
      return;
    }

    const text = this.message().trim();

    if (text) {
      this._FirestoreService.sendMessage(this.reservation(), {
        senderId: this.userId?.toString() || '',
        message: text,
        msgType: MeetingChatItemTypes.TEXT,
        replyReference: this.replyingToMessageContent() ?? null
      }, this.currentReservation);
    }
    this.replyingMessageChanged.emit(null);
    this.resetInput();
  };

  protected updateMessage = (evt: Event) => {
    const inputElement = evt.target as HTMLInputElement;
    const inputValue = inputElement?.value ?? '';

    if (inputValue.length > MAX_MESSAGE_LENGTH) {
      inputElement.value = this.message();

      this._toastService.add({
        severity: 'error',
        summary: this._localizationService.translateTextFromJson('general.error'),
        detail: 'message_too_long',
        life: 5000
      });
      return;
    }

    this.message.set(inputValue);
  };

  protected async handleFilesSelected(fileList: FileList | null, fileType: string): Promise<void> {
    if (!isPlatformBrowser(this._platformId) || !fileList?.length) {
      this.selectedFiles.set([]);
      return;
    }

    Logger.debug('MeetingChatInputComponent => Selected Files:', fileList);

    const files: File[] = Array.from(fileList);
    const reservationId = this.reservationId();

    if (!reservationId) {
      Logger.error('reservationId is required to upload chat files.');
      this.selectedFiles.set([]);
      return;
    }

    if (!files?.length) return;
    this._uploads.uploadChatFiles(reservationId, Array.from(files));
  }

  protected clearFiles = () => {
    this.selectedFiles.set([]);
    if (isPlatformBrowser(this._platformId)) {
      this.attachmentMenu?.clearFileInputs();
    }
  };

  protected handlePodcastSelected(selectedPodcast: IGlobalPodcastItemModel | null): void {
    Logger.debug('MeetingChatInputComponent => handlePodcastSelected: ', selectedPodcast);
    this._FirestoreService.sendMessage(this.reservation(), {
      senderId: this.reservation()?.user?.id?.toString() ?? '',
      message: selectedPodcast,
      msgType: MeetingChatItemTypes.PODCAST,
      replyReference: this.replyingToMessageContent() ?? null
    }, this.currentReservation);
    this.replyingMessageChanged.emit(null);
  }

  protected async startVoiceRecording(evt: MouseEvent | TouchEvent): Promise<void> {
    if (!isPlatformBrowser(this._platformId) || this.isRecordingVoice()) return;

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log('[ondataavailable] chunk added, total:', this.audioChunks.length, event.data);
          if (this.isVoicePaused && !this.recordedAudioUrl) {
            this.revokeRecordedAudioUrl();
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.recordedAudioUrl = URL.createObjectURL(audioBlob);
            console.log('[ondataavailable] Recorded audio URL (late):', this.recordedAudioUrl, audioBlob);
          }
        } else {
          console.log('[ondataavailable] empty chunk');
        }
      };

      this.mediaRecorder.onstop = async () => {
        Logger.debug('MediaRecorder stopped.');
      };

      this.mediaRecorder.start();
      Logger.debug('Voice recording started.');
      console.log('[startVoiceRecording] MediaRecorder started');

      this.isRecordingVoice.set(true);
      this.isVoiceLocked.set(false);
      this.isVoicePaused = false;
      this._pausedElapsed = 0;
      this.recordingStart = Date.now();
      this.startY = getPointerY(evt);

      this.recordingInterval = setInterval(() => this.updateRecordingTime(), 1000);
      this.attachGlobalListeners();
      this.isVoiceLocked.set(true);
    } catch (err: any) {
      Logger.error('Error accessing microphone:', err);
      this._toastService.add({
        severity: 'error',
        summary: this._localizationService.translateTextFromJson('general.error'),
        detail: this._localizationService.translateTextFromJson('microphone_access_denied'),
        life: 5000
      });
      this.stopVoiceRecording();
    }
  }

  protected onVoiceMove = (evt: MouseEvent | TouchEvent) => {
    if (
      !isPlatformBrowser(this._platformId) ||
      !this.isRecordingVoice() ||
      this.isVoiceLocked() ||
      this.startY === null
    )
      return;

    const deltaY = this.startY - getPointerY(evt);
    if (deltaY > LOCK_THRESHOLD_PX) this.isVoiceLocked.set(true);
  };

  private revokeRecordedAudioUrl(): void {
    if (this.recordedAudioUrl) {
      URL.revokeObjectURL(this.recordedAudioUrl);
      this.recordedAudioUrl = null;
    }
  }

  protected stopVoiceRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      Logger.debug('MediaRecorder stopping...');
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    this.isRecordingVoice.set(false);
    this.isVoiceLocked.set(false);
    this.recordingTime.set('00:00');

    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
    this.startY = null;
    this.audioChunks = [];
    this.isVoicePaused = false;
    this.isPlayingBack = false;
    this.revokeRecordedAudioUrl();
  };

  protected toggleVoiceLock = () => this.isRecordingVoice() && this.isVoiceLocked.update((v) => !v);

  protected toggleAttachmentMenu = (e: Event) => {
    e.stopPropagation();
    this.showAttachmentMenu.update((v) => !v);
  };

  protected togglePauseResumeVoiceRecording(): void {
    if (!this.isRecordingVoice() || !this.mediaRecorder) return;
    if (!this.isVoicePaused) {
      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.requestData();
        this.mediaRecorder.pause();
        this.isVoicePaused = true;
        if (this.recordingInterval) {
          clearInterval(this.recordingInterval);
          this.recordingInterval = null;
        }
        this._pausedElapsed += Date.now() - this.recordingStart;
        console.log('[togglePauseResumeVoiceRecording] Pausing. audioChunks after requestData:', this.audioChunks.length);
        if (this.audioChunks.length) {
          this.revokeRecordedAudioUrl();
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.recordedAudioUrl = URL.createObjectURL(audioBlob);
          console.log('[togglePauseResumeVoiceRecording] Recorded audio URL:', this.recordedAudioUrl, audioBlob);
        } else {
          console.log('[togglePauseResumeVoiceRecording] Still no audioChunks after requestData, might be too fast or no sound recorded.');
        }
      }
    } else {
      if (this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume();
        this.isVoicePaused = false;
        this.recordingStart = Date.now();
        this.recordingInterval = setInterval(() => this.updateRecordingTime(), 1000);
        this.isPlayingBack = false;
        if (this.playbackAudioRef) {
          this.playbackAudioRef.nativeElement.pause();
          this.playbackAudioRef.nativeElement.currentTime = 0;
        }
        this.revokeRecordedAudioUrl();
        console.log('[togglePauseResumeVoiceRecording] Resumed recording');
      }
    }
  }

  protected togglePlayback(): void {
    if (!this.playbackAudioRef) return;
    const audio = this.playbackAudioRef.nativeElement;
    if (audio.paused) {
      audio.currentTime = 0;
      audio.play();
      this.isPlayingBack = true;
      this.startPlaybackTimer();
      console.log('[togglePlayback] Playing audio:', this.recordedAudioUrl);
    } else {
      audio.pause();
      this.isPlayingBack = false;
      this.stopPlaybackTimer();
      console.log('[togglePlayback] Paused audio:', this.recordedAudioUrl);
    }
  }

  private startPlaybackTimer(): void {
    this.playbackTime = '00:00';
    this.stopPlaybackTimer();
    this.playbackTimer = setInterval(() => {
      if (this.playbackAudioRef) {
        const t = Math.floor(this.playbackAudioRef.nativeElement.currentTime);
        const m = Math.floor(t / 60);
        const s = t % 60;
        this.playbackTime = `${pad(m)}:${pad(s)}`;
      }
    }, 250);
  }

  private stopPlaybackTimer(): void {
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  protected onPlaybackEnded(): void {
    this.isPlayingBack = false;
    this.stopPlaybackTimer();
    this.playbackTime = '00:00';
    console.log('[onPlaybackEnded] Playback finished');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (!isPlatformBrowser(this._platformId) || !this.showAttachmentMenu()) return;
    const menu = this.attachmentMenu?.attachmentMenuContainer?.nativeElement;
    if (menu && !menu.contains(e.target as Node)) this.showAttachmentMenu.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isRecordingVoice()) this.stopVoiceRecording();
    if (this.showAttachmentMenu()) this.showAttachmentMenu.set(false);
  }

  private async finalizeVoiceRecordingAndSend(): Promise<void> {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      Logger.warn('No active recording to finalize.');
      this.stopVoiceRecording();
      return;
    }

    this.mediaRecorder.stop();

    await new Promise<void>((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const fileName = `voice_message_${Date.now()}.webm`;
        const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });

        if (this.recordedAudioUrl) {
          Logger.debug('MeetingChatInputComponent => Sending Recorded Audio (Blob URL):', this.recordedAudioUrl);
        } else {

          const newBlobUrl = URL.createObjectURL(audioBlob);
          Logger.debug('MeetingChatInputComponent => Sending Recorded Audio (New Blob URL):', newBlobUrl);
          URL.revokeObjectURL(newBlobUrl);
        }

        Logger.debug('MeetingChatInputComponent => Finalized Voice Recording for Sending (File):', audioFile);
        this.handleFilesSelected(createFileList(audioFile), 'audio');
        this.resetInput();
        resolve();
      };
    });

    this.revokeRecordedAudioUrl();
  }

  private updateRecordingTime(): void {
    if (this.isVoicePaused) return;
    const diff = Date.now() - this.recordingStart + this._pausedElapsed;
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.recordingTime.set(`${pad(m)}:${pad(s)}`);
  }

  private releaseListener = () => {
    if (this.isRecordingVoice() && !this.isVoiceLocked()) {
      Logger.debug('Voice recording released without lock. Cancelling.');
      this.stopVoiceRecording();
    }
    this.detachGlobalListeners();
  };

  private attachGlobalListeners(): void {
    if (!isPlatformBrowser(this._platformId)) return;
    document.addEventListener('mouseup', this.releaseListener);
    document.addEventListener('touchend', this.releaseListener);
  }

  private detachGlobalListeners(): void {
    if (!isPlatformBrowser(this._platformId)) return;
    document.removeEventListener('mouseup', this.releaseListener);
    document.removeEventListener('touchend', this.releaseListener);
  }
}

function createFileList(file: File): FileList {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}
