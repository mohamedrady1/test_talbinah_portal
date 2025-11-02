import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, signal, computed, PLATFORM_ID, inject, effect, Injector, Signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { KhawiikVoiceRealtimeSessionFacade, RealtimeVoiceSessionService, KhawiikBooksLookupFacade, VoicePreferenceFacade } from '../../services';
import { IKhawiikVoiceActivity, IKhawiikVoiceRealtimeSessionDataDto, IKhawiikBook, IChatHistoryItemDataDto, ISaveKhawiikVoiceTypeDataDto } from '../../dtos';
import { CHAT_KEYS, KhawiikBotRoutesEnum, WEEK_DAYS } from '../../constants';
import { ModalService, MoodModalIntegrationService, StorageKeys, SvgIconComponent } from '../../../../shared';
import { ErrorStateCardComponent, ErrorStateConfig } from '../../../../shared/components/error-state-card/error-state-card.component';
import { KhawiikVoiceTypesComponent } from '../khawiik-voice-types';
import { KhawiikVoiceChatSkeletonComponent } from '../../skeletons';
import { KhawiikActivitesComponent } from '../khawiik-activites';
import { KhawiikHistoryComponent } from '../khawiik-history';
import { KhawiikBooksComponent } from '../khawiik-books';
import { ChatRecord } from '../talbinah-bot-records';
import { IGlobalUserContactInfoModel, Logger, StorageService } from '../../../../common';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { MissionDataService } from '../../services';
import { getKhawiikVoiceChatErrorConfig } from '../../configs';
import { SessionExpiredModalComponent } from '../session-expired-modal';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'khawiik-voice-chat',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,

    KhawiikVoiceChatSkeletonComponent,
    SvgIconComponent,
    ErrorStateCardComponent
  ],
  templateUrl: './khawiik-voice-chat.component.html',
  styleUrls: ['./khawiik-voice-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikVoiceChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  // ====== Dependencies ======
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);
  protected readonly _sessionFacade = inject(KhawiikVoiceRealtimeSessionFacade);
  protected readonly _realtimeService = inject(RealtimeVoiceSessionService);
  private readonly _injector = inject(Injector);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly roleGuardService = inject(RoleGuardService);
  private readonly khawiikBooksFacade = inject(KhawiikBooksLookupFacade);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  // ====== View References ======
  @ViewChild('messagesContainer', { static: false })
  protected messagesContainer?: ElementRef<HTMLDivElement>;

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _VoicePreferenceFacade = inject(VoicePreferenceFacade);

  // ====== Constants ======
  readonly weekDays = WEEK_DAYS;
  readonly keys = CHAT_KEYS;

  // ====== State ======
  isRecording = signal(false);
  isMuted = signal(false);
  private recordingStartTime: number = 0;
  private sessionId: string = '';
  private currentCard: IKhawiikBook | null = null;
  protected currentBook = signal<IKhawiikBook | null>(null);
  private recordingTimer: any = null;
  private recordingDuration: number = 0;
  private hasInitialized = false;

  // Session expiry tracking
  private expiryTimer: any = null;
  private remainingSeconds = signal<number | null>(null);

  // New signal to track if previous session is complete
  private isPreviousSessionComplete = signal(true);

  readonly errorStateConfig = getKhawiikVoiceChatErrorConfig(() => this._startNewConversation());
  readonly currentDate = computed(() => {
    if (!this.isBrowser) return '';
    return new Date().toLocaleDateString('ar', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  // Messages from service
  readonly incomingMessages = this._realtimeService.incomingMessages;
  protected currentMessage = signal<string>('');
  protected nextMessage = signal<string>('');
  protected isFullScreen = signal(false);

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize effects in constructor (injection context)
    this._initSubscriptions();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Store Khawiaak user information in localStorage
      const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IGlobalUserContactInfoModel } | null;
      const currentUserInfo = storedUserInfo?.user;

      this._StorageService.setItem(StorageKeys.KHAWIAAK_USER, {
        userId: this._UserContextService.user()?.user?.id || currentUserInfo?.id,
        isStartKhawiaak: true,
        type: KhawiikBotRoutesEnum.VOICE_CHAT
      });

      // Initialize conversation
      this._initializeConversation();

      // Subscribe to current card changes
      this._initCardSubscription();

      // Fetch and start session automatically
      this._sessionFacade.fetchRealtimeSession();

      // ✅ Subscribe to saved voice preference for voice switching
      this._VoicePreferenceFacade.savedVoice$.subscribe(async (saved: ISaveKhawiikVoiceTypeDataDto | null) => {
        const currentUrl = this._router.url;
        const isVoiceChatRoute = currentUrl.includes(`/${KhawiikBotRoutesEnum.VOICE_CHAT}`);

        if (saved && isVoiceChatRoute) {
          Logger.debug('✅KhawiikVoiceChatComponent | Voice preference changed:', saved);

          // Wait for previous session to complete before starting new one
          if (this.isPreviousSessionComplete()) {
            this.isPreviousSessionComplete.set(false);

            // If we're currently recording, restart session with new voice
            if (this.isRecording()) {
              await this._switchVoiceDuringSession(saved.voice);
            } else {
              // If not recording, fetch new session and it will auto-start
              // Pass isPreviousSessionComplete as second parameter
              this._sessionFacade.fetchRealtimeSession(
                saved.voice,
                this.isPreviousSessionComplete()
              );
            }

            // Mark as complete after processing
            setTimeout(() => {
              this.isPreviousSessionComplete.set(true);
            }, 100);
          } else {
            Logger.debug('KhawiikVoiceChatComponent | Previous session change still in progress, skipping...');
          }
        }
      });

      this.hasInitialized = true;
    }
  }

  ngAfterViewInit(): void {
    // View initialization complete - no additional setup needed
  }

  ngOnDestroy(): void {
    this._realtimeService.stopSession();
    this._stopRecordingTimer();
    this._stopExpiryTimer();

    // Track final duration if recording was active
    if (this.isRecording()) {
      const finalDurationSeconds = Math.round(this.recordingDuration / 1000);
      if (finalDurationSeconds > 0 && this.currentCard) {
        this._trackVoiceDuration(finalDurationSeconds);
      }
    }

    // Clear current card if navigating away from voice/text chat pages
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      const isKhawiikRoute = currentUrl.includes(KhawiikBotRoutesEnum.VOICE_CHAT) ||
        currentUrl.includes(KhawiikBotRoutesEnum.TEXT_CHAT);

      // Only clear if we're leaving the khawiik chat pages entirely
      if (!isKhawiikRoute) {
        this.currentBook.set(null);
        this.khawiikBooksFacade.setCurrentCard(null);
        Logger.debug('KhawiikVoiceChatComponent | Cleared currentCard on destroy (leaving khawiik pages)');
      } else {
        Logger.debug('KhawiikVoiceChatComponent | Component destroyed, currentCard preserved for navigation');
      }
    }
  }

  // ====== UI Helpers ======
  protected getDayName(day: typeof WEEK_DAYS[0]): string {
    const dayKey = day.dayName.toUpperCase() as keyof typeof this.keys.COMMON.WEEK_DAYS;
    return this.keys.COMMON.WEEK_DAYS[dayKey];
  }

  protected isToday(day: typeof WEEK_DAYS[0]): boolean {
    return !!day.isToday;
  }

  // ====== Actions ======
  protected onTextClick(): void {
    if (!this.isBrowser) return;
    // Clear current book when switching to text chat
    this.currentBook.set(null);
    this.khawiikBooksFacade.setCurrentCard(null);
    this._router.navigate([
      `${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}/`,
      KhawiikBotRoutesEnum.TEXT_CHAT,
    ]);
  }

  protected onNewChatClick(): void {
    if (!this.isBrowser) return;

    Logger.debug('KhawiikVoiceChatComponent | Starting new voice session from + button');
    // Clear current book when starting new chat
    this.currentBook.set(null);
    this.khawiikBooksFacade.setCurrentCard(null);

    // Stop any active recording and session
    if (this.isRecording()) {
      this.isRecording.set(false);
      this._realtimeService.stopSession();
      this._stopRecordingTimer();
    }

    // Clear all messages and reset state
    this._startNewConversation();

    // Reset session completion flag
    this.isPreviousSessionComplete.set(false);

    // Fetch new realtime session which will auto-start
    this._sessionFacade.fetchRealtimeSession();

    // Mark as complete after a short delay to allow session to start
    setTimeout(() => {
      this.isPreviousSessionComplete.set(true);
    }, 500);

    Logger.debug('KhawiikVoiceChatComponent | New voice session started successfully');
  }

  protected onFullScreenClick(): void {
    if (!this.isBrowser) return;
    Logger.debug('KhawiikVoiceChatComponent | Fullscreen clicked');
    this.isFullScreen.set(!this.isFullScreen());
    const chatArea = document.querySelector('#khawiik-voice-chat__chat-area') as HTMLElement;
    if (!chatArea) return;

    if (!document.fullscreenElement) {
      chatArea.requestFullscreen();
      this.isFullScreen.set(true);
    } else {
      document.exitFullscreen();
      this.isFullScreen.set(false);
    }
  }

  protected openSettingsModal(): void {
    if (!this.isBrowser) return;
    this._modalService.open(KhawiikVoiceTypesComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
        from: 'chat',
      },
      outputs: { closed: () => Logger.debug('KhawiikVoiceChatComponent | Settings modal closed') },
      width: '60%',
      minHeight: '30vh',
      maxHeight: '78vh',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikVoiceChatComponent | Settings modal closed')
    });
  }

  protected _openKhawiikActivitesModal(): void {
    if (!this.isBrowser) return;

    this._modalService.open(KhawiikActivitesComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        closed: (item: IKhawiikVoiceActivity | null) => {
          Logger.debug('KhawiikVoiceChatComponent | Activities modal closed | item:', item);
          this._modalService.closeAll(); // Close the modal before navigating

          // Check if an activity was selected
          if (item) {
            // Navigate to the text chat and pass the activity slug in the state
            this._router.navigate([
              `${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}/`,
              KhawiikBotRoutesEnum.TEXT_CHAT,
            ], {
              state: {
                fromActivity: true,
                activitySlug: item.slug,
              }
            });
          }
        },
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      onCloseClick: () => Logger.debug('KhawiikVoiceChatComponent | Activites modal closed')
    });
  }

  protected _openKhawiikHistoryModal(): void {
    const canAccess = this.roleGuardService.checkAccessOrOpenModal();
    if (!canAccess) {
      return;
    }
    this._modalService.open(KhawiikHistoryComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        chatSelected: (item: ChatRecord | null) => {
          Logger.debug('KhawiikVoiceChatComponent | History modal closed | chatSelected:', item);
          if (item && typeof item.id === 'number') {
            Logger.debug('KhawiikVoiceChatComponent | Navigating to text chat with selected chat ID:', item.id);
            // Navigate to text chat with the selected chat data
            this.currentBook.set(null);
            this.khawiikBooksFacade.setCurrentCard(null);
            this._router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT], {
              state: {
                fromVoiceHistory: true,
                selectedChat: item,
                chatId: item.id
              }
            });
            this._modalService.closeAll();
          } else {
            Logger.debug('KhawiikVoiceChatComponent | No valid chat ID found:', item);
          }
        },
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      onCloseClick: () => Logger.debug('KhawiikVoiceChatComponent | History modal closed')
    });
  }

  protected _openKhawiikBooksModal(): void {
    if (!this.isBrowser) return;

    const canAccess = this.roleGuardService.checkAccessOrOpenModal();
    if (!canAccess) {
      return;
    }

    Logger.debug('KhawiikVoiceChatComponent | Opening KhawiikBooks modal');

    const modalRef = this._modalService.open(KhawiikBooksComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        closed: (card: IKhawiikBook | null) => {
          Logger.debug('KhawiikVoiceChatComponent | closed event received | card: ', card);
          if (card) {
            Logger.debug('KhawiikVoiceChatComponent | Setting current card:', card.slug);
            // Set the current card in the facade - the subscription will update currentBook automatically
            this.khawiikBooksFacade.setCurrentCard(card);
          }
        },
        chatSelected: (item: ChatRecord | null) => {
          Logger.debug('KhawiikVoiceChatComponent | chatSelected event received | item: ', item);
          if (item && typeof item.id === 'number') {
            Logger.debug('KhawiikVoiceChatComponent | Navigating to text chat with selected chat ID:', item.id);
            // Navigate to text chat with the selected chat data
            this._router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT], {
              state: {
                fromVoiceHistory: true,
                selectedChat: item,
                chatId: item.id
              }
            });
            this._modalService.closeAll();
          } else {
            Logger.debug('KhawiikVoiceChatComponent | No valid chat ID found:', item);
          }
        },
        titleUpdated: (updatedChat: IChatHistoryItemDataDto) => {
          Logger.debug('KhawiikVoiceChatComponent | titleUpdated event received | updatedChat: ', updatedChat);
          // This event is mainly for text chat, but we can handle it here if needed
        }
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikVoiceChatComponent | onCloseClick | The modal is closed')
    });

    Logger.debug('KhawiikVoiceChatComponent | Modal opened successfully');
  }

  // ====== Recording ======
  protected async onRecordClick(): Promise<void> {
    this.isRecording.update((val) => !val);

    if (this.isRecording()) {
      // Start recording and store start time
      this.recordingStartTime = Date.now();
      await this._startRealtimeSession();
      this._startRecordingTimer();
    } else {
      // Stop recording and calculate duration
      const durationSeconds = Math.round(this.recordingDuration / 1000);
      this._realtimeService.stopSession();
      this._stopRecordingTimer();

      // Track voice duration if we have a current card and duration > 0
      Logger.debug('KhawiikVoiceChatComponent | Tracking voice duration:', { durationSeconds, currentCard: this.currentCard });
      if (this.currentCard && this.currentCard.type === 'voice' && durationSeconds > 0) {
        this._trackVoiceDuration(durationSeconds);
      }

      console.log(`Recording stopped. Duration: ${durationSeconds} seconds`);
    }
  }

  private _startRecordingTimer(): void {
    if (!this.isBrowser) return;

    this.recordingDuration = 0;

    // Store in sessionStorage
    sessionStorage.setItem('voiceRecordingStartTime', this.recordingStartTime.toString());
    sessionStorage.setItem('voiceRecordingActive', 'true');

    // Start timer to update duration every second
    this.recordingTimer = setInterval(() => {
      this.recordingDuration = Date.now() - this.recordingStartTime;
      sessionStorage.setItem('voiceRecordingDuration', this.recordingDuration.toString());
    }, 1000);

    Logger.debug('KhawiikVoiceChatComponent | Recording timer started');
  }

  private _stopRecordingTimer(): void {
    if (!this.isBrowser) return;

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    // Calculate final duration
    const finalDuration = this.recordingDuration;

    // Clear sessionStorage
    sessionStorage.removeItem('voiceRecordingStartTime');
    sessionStorage.removeItem('voiceRecordingActive');
    sessionStorage.removeItem('voiceRecordingDuration');

    // Log to console
    console.log('Voice recording stopped. Total duration:', this._formatDuration(finalDuration));
    Logger.debug('KhawiikVoiceChatComponent | Recording stopped. Duration:', finalDuration);
  }

  private _formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  protected onVoiceClick(): void {
    if (!this.isBrowser) return;

    // Start new session and store in sessionStorage
    this._startNewSessionInStorage();

    this.isMuted.update((val) => !val);
    Logger.debug('KhawiikVoiceChatComponent | Voice button clicked - Muted:', this.isMuted());

    // Here you can add actual mute/unmute logic for the audio
    // For example, mute the audio element or microphone
    this._toggleAudioMute();
  }

  // ====== Private ======
  private async _startRealtimeSession(): Promise<void> {
    try {
      const session: IKhawiikVoiceRealtimeSessionDataDto | null = this._sessionFacade.keyResponse();
      await this._realtimeService.startSession(session);
    } catch (err) {
      Logger.error('KhawiikVoiceChatComponent | Failed to start session', err);
    }
  }

  private async _switchVoiceDuringSession(newVoice: string): Promise<void> {
    try {
      Logger.debug('KhawiikVoiceChatComponent | Switching voice during active session:', newVoice);

      // Store current recording state
      const wasRecording = this.isRecording();
      const wasMuted = this.isMuted();

      if (wasRecording) {
        // Temporarily stop the session but don't reset timer if previous session is complete
        this._realtimeService.stopSession();

        // Only stop recording timer if previous session is complete
        if (this.isPreviousSessionComplete()) {
          this._stopRecordingTimer();
        }
      }

      // Fetch new session with the updated voice and pass isPreviousSessionComplete
      this._sessionFacade.fetchRealtimeSession(
        newVoice,
        this.isPreviousSessionComplete()
      );

      // Wait for new session data and restart
      if (wasRecording) {
        // Use a small delay to ensure new session data is available
        setTimeout(async () => {
          const newSession: IKhawiikVoiceRealtimeSessionDataDto | null = this._sessionFacade.keyResponse();
          if (newSession) {
            await this._realtimeService.restartSession(newSession);
            Logger.debug('KhawiikVoiceChatComponent | recordingTimer: ', this.recordingTimer);

            // Only start recording timer if previous session is complete
            if (this.isPreviousSessionComplete()) {
              this._startRecordingTimer();
            }

            // Restore mute state
            if (wasMuted) {
              this._realtimeService.toggleMicrophone(true);
            }

            Logger.debug('KhawiikVoiceChatComponent | Voice switched successfully during active session');
          }
        }, 500);
      }
    } catch (err) {
      Logger.error('KhawiikVoiceChatComponent | Failed to switch voice during session', err);
      // Restore recording state on error
      if (this.isRecording()) {
        this.isRecording.set(false);
      }
    }
  }

  private _initializeConversation(): void {
    if (!this.isBrowser) return;
    Logger.debug('KhawiikVoiceChatComponent | Initializing conversation');

    // Only clear if we don't have existing messages
    if (this.incomingMessages().length === 0) {
      this.currentMessage.set('');
      this.nextMessage.set('');
    }

    this.isRecording.set(false);
    this.isMuted.set(false);
    Logger.debug('KhawiikVoiceChatComponent | Conversation initialized');
  }

  private _startNewConversation(): void {
    if (!this.isBrowser) return;
    Logger.debug('KhawiikVoiceChatComponent | Starting new conversation - clearing all state');

    // Stop any active session first
    this._realtimeService.stopSession();

    // Clear existing conversation from service
    this._realtimeService.clearMessages();
    Logger.debug('KhawiikVoiceChatComponent | Service messages cleared, incoming messages count:', this.incomingMessages().length);

    // Clear local messages and state
    this.currentMessage.set('');
    this.nextMessage.set('');
    this.isRecording.set(false);
    this.isMuted.set(false);
    Logger.debug('KhawiikVoiceChatComponent | Local state cleared');

    // Reset session facade state
    this._sessionFacade.resetState();
  }

  private _initSubscriptions(): void {
    effect(() => {
      // When session is successfully fetched and ready, automatically start it
      if (this._sessionFacade.sessionId() &&
        !this._sessionFacade.isLoading() &&
        this._sessionFacade.status() === true &&
        this._sessionFacade.keyResponse()) {

        // Start expiry timer
        const secondsUntilExpiry = this._sessionFacade.secondsUntilExpiry();
        if (secondsUntilExpiry) {
          this._startExpiryTimer(secondsUntilExpiry);
        }

        // Auto-start the session only if there's a saved voice
        const savedVoice = this._VoicePreferenceFacade.savedVoice$;
        savedVoice.subscribe((voice) => {
          if (voice) {
            Logger.debug('KhawiikVoiceChatComponent | Saved voice exists, auto-starting session');
            this._autoStartSession();
          } else {
            Logger.debug('KhawiikVoiceChatComponent | No saved voice, skipping auto-start');
          }
        });

      }
    });
  }

  private async _autoStartSession(): Promise<void> {
    try {
      const session: IKhawiikVoiceRealtimeSessionDataDto | null = this._sessionFacade.keyResponse();
      if (session) {
        await this._realtimeService.startSession(session);

        // Auto-start recording when session is successfully started
        if (this._realtimeService.connectionState() === 'connected') {
          this.isRecording.set(true);
          // this.recordingStartTime = Date.now();
          // this._startRecordingTimer();
          Logger.debug('KhawiikVoiceChatComponent | recordingTimer: ', this.recordingTimer);
          Logger.debug('KhawiikVoiceChatComponent | Session auto-started and recording began');
        }
      }
    } catch (err) {
      Logger.error('KhawiikVoiceChatComponent | Failed to auto-start session', err);
      this.isRecording.set(false);
    }
  }

  private _toggleAudioMute(): void {
    if (!this.isBrowser) return;

    try {
      // Use the realtime service to mute/unmute the microphone
      if (this._realtimeService && this.isRecording()) {
        this._realtimeService.toggleMicrophone(this.isMuted());
        Logger.debug('KhawiikVoiceChatComponent | Microphone mute toggled via service:', this.isMuted());
      } else {
        Logger.debug('KhawiikVoiceChatComponent | No active recording session to mute');
      }
    } catch (error) {
      Logger.error('KhawiikVoiceChatComponent | Error toggling microphone mute:', error);
    }
  }

  private _startNewSessionInStorage(): void {
    if (!this.isBrowser) return;

    // Generate new session ID
    this.sessionId = `voice_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store session data in sessionStorage
    const sessionData = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      isActive: true
    };

    sessionStorage.setItem('khawiik_voice_session', JSON.stringify(sessionData));

    Logger.debug('KhawiikVoiceChatComponent | New session started and stored:', sessionData);
  }

  private _calculateRecordingDuration(): number {
    if (this.recordingStartTime === 0) return 0;

    const currentTime = Date.now();
    const durationMs = currentTime - this.recordingStartTime;
    const durationSeconds = Math.round(durationMs / 1000);

    // Update sessionStorage with recording duration
    if (this.isBrowser) {
      const sessionData = sessionStorage.getItem('khawiik_voice_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.recordingDuration = durationSeconds;
        session.lastRecordingEnd = currentTime;
        sessionStorage.setItem('khawiik_voice_session', JSON.stringify(session));
      }
    }

    return durationSeconds;
  }

  private _initCardSubscription(): void {
    if (!this.isBrowser) return;

    // Initialize with current value from facade (synchronous)
    const initialCard = this.khawiikBooksFacade.getCurrentCard();
    if (initialCard) {
      this.currentCard = initialCard;
      this.currentBook.set(initialCard);
      Logger.debug('KhawiikVoiceChatComponent | Initial book from facade:', initialCard.slug);
    }

    // Subscribe to current card changes
    this.khawiikBooksFacade.currentCard$.subscribe((card: IKhawiikBook | null) => {
      this.currentCard = card;
      this.currentBook.set(card);
      if (card) {
        Logger.debug('KhawiikVoiceChatComponent | Current card updated from facade:', card.slug);
      }
    });
  }

  private _trackVoiceDuration(seconds: number): void {
    if (!this.isBrowser || !this.currentCard || seconds <= 0) return;

    Logger.debug('KhawiikVoiceChatComponent | Tracking voice duration:', { seconds, missionSlug: this.currentCard.slug });

    this.khawiikBooksFacade.trackVoiceDuration(seconds).subscribe({
      next: (response: any) => {
        console.log('Voice track API response:', response);
      },
      error: (error: any) => {
        console.error('Voice track API error:', error);
      }
    });
  }

  private _startExpiryTimer(initialSeconds: number): void {
    if (!this.isBrowser) return;

    // Stop any existing timer
    this._stopExpiryTimer();

    // Set initial value
    this.remainingSeconds.set(initialSeconds);
    Logger.debug('KhawiikVoiceChatComponent | Session expiry timer started. Initial seconds:', initialSeconds);

    // Start countdown
    this.expiryTimer = setInterval(() => {
      const current = this.remainingSeconds();
      if (current !== null && current > 0) {
        const newValue = current - 1;
        this.remainingSeconds.set(newValue);
        Logger.debug('KhawiikVoiceChatComponent | Session expires in:', newValue, 'seconds');

        // When timer reaches 0, show modal
        if (newValue === 0) {
          this._handleSessionExpired();
        }
      }
    }, 1000);
  }

  private _stopExpiryTimer(): void {
    if (!this.isBrowser) return;

    if (this.expiryTimer) {
      clearInterval(this.expiryTimer);
      this.expiryTimer = null;
      Logger.debug('KhawiikVoiceChatComponent | Session expiry timer stopped');
    }
  }

  private _handleSessionExpired(): void {
    if (!this.isBrowser) return;

    Logger.debug('KhawiikVoiceChatComponent | Session expired - showing modal');

    // Stop recording and session
    if (this.isRecording()) {
      this.isRecording.set(false);
      this._realtimeService.stopSession();
      this._stopRecordingTimer();
    }

    // Reset to welcome state
    // this._startNewConversation();
    this.isRecording.set(false);
    this._realtimeService.stopSession();
    this._stopRecordingTimer();
    this._realtimeService.clearMessages();

    // Stop expiry timer
    this._stopExpiryTimer();

    // Open session expired modal
    this._modalService.open(SessionExpiredModalComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'time_period_ended'
      },
      outputs: {

        startNewSession: () => {
          Logger.debug('KhawiikVoiceChatComponent | Starting new session from expired modal');
          this._modalService.closeAll();

          // Fetch new session which will auto-start
          this._sessionFacade.fetchRealtimeSession();

          this._autoStartSession();
        },
      },
      width: '30%',
      minHeight: '30vh',
      maxHeight: '50vh',
      onCloseClick: () => {
        Logger.debug('KhawiikVoiceChatComponent | Session expired modal closed');
        this._sessionFacade.fetchRealtimeSession();
      }
    });
  }
}
