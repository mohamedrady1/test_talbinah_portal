import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, signal, computed, PLATFORM_ID, inject, effect, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CHAT_KEYS, KhawiikBotRoutesEnum, WEEK_DAYS } from '../../constants';
import { ModalService, MoodModalIntegrationService, SvgIconComponent, StorageKeys, ErrorStateCardComponent, LocalizationService } from '../../../../shared';
import { KhawiikVoiceTypesComponent } from '../khawiik-voice-types';
import { KhawiikActivitesComponent } from '../khawiik-activites';
import { ChatMessagesSkeletonComponent } from '../../skeletons';
import { KhawiikHistoryComponent } from '../khawiik-history';
import { ChatRecord } from '../talbinah-bot-records';
import { ConversationFacade, ChatHistoryFacade, MissionDataService, KhawiikBooksLookupFacade } from '../../services';
import { IKhawiikVoiceActivity, IStartNewChatRequestDto, IChatHistoryItemDataDto, IStartMissionDataDto, IKhawiikBook } from '../../dtos';
import { IGlobalUserContactInfoModel, Logger, StorageService } from '../../../../common';
import { ChatMessage } from '../../models';
import { IUser, RoleGuardService, UserContextService } from '../../../authentication';
import { getKhawiikTextChatErrorConfig } from '../../configs';
import { KhawiikBooksComponent } from '../khawiik-books';
import { ChatEventsService } from '../../services/chat-events.service';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'khawiik-text-chat',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ChatMessagesSkeletonComponent,
    SvgIconComponent,
    ErrorStateCardComponent
  ],
  templateUrl: './khawiik-text-chat.component.html',
  styleUrls: ['./khawiik-text-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikTextChatComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  // ====== Dependencies ======
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);
  private readonly _storageService = inject(StorageService);
  private readonly _localizationService = inject(LocalizationService);
  protected readonly _conversationFacade = inject(ConversationFacade);
  protected readonly _chatHistoryFacade = inject(ChatHistoryFacade);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly missionDataService = inject(MissionDataService);
  private readonly _khawiikBooksFacade = inject(KhawiikBooksLookupFacade);
  private readonly _chatEvents = inject(ChatEventsService);


  // ====== View References ======
  @ViewChild('messagesContainer', { static: false }) protected messagesContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput', { static: false }) protected messageInput?: ElementRef<HTMLInputElement>;

  // ====== Constants ======
  readonly weekDays = WEEK_DAYS;
  readonly keys = CHAT_KEYS;

  // ====== Signals / State ======
  private readonly _messageText = signal('');
  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _isSending = signal(false);
  private readonly _error = signal<string | null>(null);
  protected isFullScreen = signal(false);
  protected missionData = signal<IStartMissionDataDto | null>(null);
  protected currentBook = signal<IKhawiikBook | null>(null);

  // Title editing functionality
  protected updatedChat = signal<IChatHistoryItemDataDto | null>(null);
  readonly isEditingNameLoading = this._chatHistoryFacade.isEditingNameLoading;
  readonly editNameStatus = this._chatHistoryFacade.status;
  readonly isEditingTitle = signal(false);
  @Input() chatSelectedItem = signal<IChatHistoryItemDataDto | null>(null);
  @Output() chatTitleUpdated = new EventEmitter<IChatHistoryItemDataDto>();

  readonly errorStateConfig = getKhawiikTextChatErrorConfig(() => this._startNewChat());
  readonly chatTitle = computed(() => {
    return this.updatedChat()?.name || this.chatSelectedItem()?.name || 'محادثة جديدة';
  });

  readonly editableTitle = signal<string>('محادثة جديدة');
  readonly lastSavedTitle = signal<string>('محادثة جديدة');

  // Conversation facade state
  readonly currentConversation = this._conversationFacade.currentConversation;
  readonly isConversationLoading = this._conversationFacade.isConversationLoading;
  readonly conversationStatus = this._conversationFacade.conversationStatus;
  readonly conversationErrorMessage = this._conversationFacade.conversationErrorMessage;
  readonly isMessageSending = this._conversationFacade.isMessageSending;

  // New chat loading state
  readonly isNewChatLoading = signal<boolean>(false);

  // User info
  protected userInfo!: IGlobalUserContactInfoModel;

  readonly messageText = this._messageText.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isSending = this._isSending.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isSubmitEnabled = computed(() => this.messageText().trim().length > 0);
  readonly hasMessages = computed(() => {
    const hasMessages = this.messages().length > 0 || this.missionData() !== null;
    Logger.debug('KhawiikTextChatComponent | hasMessages:', hasMessages, 'messages count:', this.messages().length, 'missionData:', !!this.missionData());
    return hasMessages;
  });

  readonly currentDate = computed(() => {
    if (!this.isBrowser) return '';
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const lang = this._localizationService.getCurrentLanguage();
    return now.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
  });

  readonly hasActiveBook = computed(() => this.currentBook() !== null);

  // SSR-safe browser check
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser: boolean;
  private readonly _RoleGuardService = inject(RoleGuardService);

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _Router = inject(Router);

  // ----- Auth / Guest Computed -----
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );

  protected readonly isLoggedIn = computed(() => !!this.token());

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  // ====== Subscriptions ======
  // Removed local message subscription as we now rely on conversation state changes

  // ====== Lifecycle ======
  constructor() {
    // React to rename broadcasts to update title if this chat is open
    this._chatEvents.titleUpdated$.subscribe(evt => {
      const current = this.chatSelectedItem?.();
      if (evt && current && current.id === evt.id) {
        // update title locally; conversation content unaffected
        this.updatedChat?.set?.({ ...(current as any), name: evt.name });
      }
    });
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Subscribe to mission data
    this.missionDataService.missionData$.subscribe(data => {
      if (data) {
        this.missionData.set(data);
        Logger.debug('KhawiikTextChatComponent | Mission data received:', data);
      }
    });

    // React to deletion broadcasts to reset UI if current chat was deleted
    this._chatEvents.chatDeleted$.subscribe(evt => {
      const activeId = this._chatEvents.getActiveChatId();
      if (evt && activeId != null && evt.id === activeId) {
        // Reset local state so welcome screen shows
        this._messages.set([]);
        this.missionData.set(null);
        this.chatSelectedItem.set(null);
        this.updatedChat.set(null);
        this.lastSavedTitle.set('محادثة جديدة');
        this.isEditingTitle.set(false);
        // Also clear conversation state in facade
        this._conversationFacade.resetStates();
      }
    });

    // Effect to watch for conversation changes from facade
    effect(() => {
      const conversation = this.currentConversation();
      if (conversation && conversation.length > 0) {
        Logger.debug('KhawiikTextChatComponent | Conversation loaded:', conversation);

        // Clear existing messages and load the conversation
        this._messages.set([]);

        conversation.forEach((messageItem: any) => {
          // Add user message if it exists
          if (messageItem.message) {
            this._addMessage({
              id: `user-${messageItem.id || Date.now()}`,
              content: messageItem.message,
              timestamp: messageItem.message_timestamp || new Date().toISOString(),
              sender: 'user',
              type: 'text'
            });
          }

          // Add bot response if it exists
          if (messageItem.replay) {
            this._addMessage({
              id: `bot-${messageItem.id || Date.now()}`,
              content: messageItem.replay,
              timestamp: messageItem.replay_timestamp || new Date().toISOString(),
              sender: 'bot',
              type: 'text'
            });
          }
        });

        // Scroll to bottom after loading conversation
        setTimeout(() => this._scrollToBottom(), 100);
      }
    });

    // Effect to handle loading states
    effect(() => {
      const isLoading = this.isConversationLoading();
      this._isLoading.set(isLoading);
    });

    // Effect to handle message sending state
    effect(() => {
      const isSending = this.isMessageSending();
      this._isSending.set(isSending);
    });

    // Effect to handle chat selection changes
    effect(() => {
      const selectedItem = this.chatSelectedItem();
      if (selectedItem && selectedItem.id != null) {
        this._chatEvents.setActiveChatId(selectedItem.id as number);
        const lastDeletedId = this._chatEvents.getLastDeletedId();
        if (lastDeletedId != null && lastDeletedId === (selectedItem.id as number)) {
          Logger.debug('KhawiikTextChatComponent: selected chat was just deleted, skipping fetch and resetting state');
          this._conversationFacade.resetStates();
          this._messages.set([]);
          this.missionData.set(null);
          this.updatedChat.set(null);
          this.chatSelectedItem.set(null);
          this.lastSavedTitle.set('محادثة جديدة');
          this.isEditingTitle.set(false);
          return;
        }
        Logger.debug(`KhawiikTextChatComponent: chatSelectedItem changed, fetching conversation ID: ${selectedItem.id}`);
        this._conversationFacade.fetchConversation(selectedItem.id as number);
        this.lastSavedTitle.set(selectedItem.name ?? 'محادثة جديدة');
        // Reset updatedChat when chatSelectedItem changes
        this.updatedChat.set({ ...selectedItem });

        // Reset editing state when switching chats
        this.isEditingTitle.set(false);
        this.editableTitle.set(selectedItem.name ?? 'محادثة جديدة');
      } else {
        this._chatEvents.setActiveChatId(null);
        Logger.debug('KhawiikTextChatComponent: chatSelectedItem is null or has no ID, resetting conversation state.');
        this._conversationFacade.resetStates();
        this.lastSavedTitle.set('محادثة جديدة');
        this.updatedChat.set(null);

        // Reset editing state when no chat is selected
        this.isEditingTitle.set(false);
        this.editableTitle.set('محادثة جديدة');
      }
    });

    // Effect to handle title editing completion
    effect(() => {
      if (!this.isEditingNameLoading() && this.editNameStatus()) {
        this.isEditingTitle.set(false);
      }
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Initialize currentBook with the current value from facade (synchronous)
    const initialCard = this._khawiikBooksFacade.getCurrentCard();
    if (initialCard) {
      this.currentBook.set(initialCard);
      Logger.debug('KhawiikTextChatComponent | Initial book from facade in ngOnInit:', initialCard);
    }

    // Subscribe to current book changes from facade
    this._khawiikBooksFacade.currentCard$.subscribe((card: IKhawiikBook | null) => {
      this.currentBook.set(card);
      Logger.debug('KhawiikTextChatComponent | Current book changed from facade:', card);
    });

    // Load user info
    const storedUserInfo = this._storageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IGlobalUserContactInfoModel } | null;
    if (storedUserInfo && storedUserInfo.user) {
      this.userInfo = storedUserInfo.user;
    }


    // Store Khawiaak user information in localStorage
    this._storageService.setItem(StorageKeys.KHAWIAAK_USER, {
      userId: this.userInfo.id || this._UserContextService.user()?.user?.id,
      isStartKhawiaak: true,
      type: KhawiikBotRoutesEnum.TEXT_CHAT
    });

    // Removed _initSubscriptions call as we no longer need local message subscription

    const navigationState = this._router.getCurrentNavigation()?.extras?.state || history.state;

    // Check if coming from voice chat history
    if (navigationState?.fromVoiceHistory) {
      Logger.debug('KhawiikTextChat | Coming from voice chat history with chat:', navigationState.selectedChat);

      if (navigationState.selectedChat && navigationState.chatId) {
        // Set the selected chat and load its conversation
        const chatData = {
          id: navigationState.chatId,
          name: navigationState.selectedChat.name || `محادثة رقم ${navigationState.chatId}`,
          created_at: navigationState.selectedChat.created_at || new Date().toISOString(),
          updated_at: navigationState.selectedChat.updated_at || new Date().toISOString()
        };

        this.chatSelectedItem.set(chatData);
        this.updatedChat.set(chatData);
        this.lastSavedTitle.set(chatData.name);

        Logger.debug('KhawiikTextChat | Chat data set, effect will handle fetchConversation');
      }
      return;
    }

    // Check if coming from doctor compatibility rating
    if (navigationState?.fromDoctorCompatibility) {
      Logger.debug('KhawiikTextChat | Coming from doctor compatibility with doctor_id:', navigationState.doctorId);

      // Start new chat with doctor_id
      this._messages.set([]);
      this._startNewChat(undefined, navigationState.doctorId);
      return;
    }

    // Check if coming from activity selection
    if (navigationState?.fromActivity) {
      Logger.debug('KhawiikTextChat | Coming from activity with slug:', navigationState.activitySlug);

      // If we have activity response data, display it
      Logger.debug('KhawiikTextChat | Displaying activity response:', navigationState.activityResponse);
      this._messages.set([]);
      this._startNewChat(navigationState.activitySlug);
      // Display the bot response from activity
      if (navigationState.activityResponse?.replay) {
        this._addMessage({
          id: `bot-${Date.now()}`,
          content: navigationState.activityResponse.replay,
          timestamp: new Date().toISOString(),
          sender: 'bot',
          type: 'text'
        });
      }
      return;
    }
    // this.moodModalIntegrationService.checkMoodModal();

  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    // Clear mission data when component is destroyed
    this.missionDataService.clearMissionData();

    // Clear current card if navigating away from voice/text chat pages
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      const isKhawiikRoute = currentUrl.includes(KhawiikBotRoutesEnum.VOICE_CHAT) ||
        currentUrl.includes(KhawiikBotRoutesEnum.TEXT_CHAT);

      // Only clear if we're leaving the khawiik chat pages entirely
      if (!isKhawiikRoute) {
        this.currentBook.set(null);
        this._khawiikBooksFacade.setCurrentCard(null);
        Logger.debug('KhawiikTextChatComponent | Cleared currentCard on destroy (leaving khawiik pages)');
      }
    }
  }

  // ====== Template actions ======
  protected onMessageChange(event: Event): void {
    if (!this.isBrowser) return;
    const target = event.target as HTMLInputElement;
    this._messageText.set(target.value);
  }

  protected onSubmit(): void {
    if (!this.isBrowser || !this.isSubmitEnabled()) return;

    const message = this.messageText().trim();
    if (!message) return;

    this._addMessage({
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toISOString(),
      sender: 'user',
      type: 'text'
    });

    this._messageText.set('');
    this._error.set(null);

    // send through facade - sending state will be handled by the facade
    this._conversationFacade.sendMessage(message);
  }

  protected onVoiceClick(): void {
    if (!this.isBrowser) return;
    // Clear current book when switching to voice chat
    this.currentBook.set(null);
    this._khawiikBooksFacade.setCurrentCard(null);
    this._router.navigate([`${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}/`, KhawiikBotRoutesEnum.VOICE_CHAT]);
  }

  protected onNewChatClick(): void {
    if (!this.isBrowser) return;
    // Clear mission data and current book when starting a new chat
    this.missionDataService.clearMissionData();
    this.currentBook.set(null);
    this._khawiikBooksFacade.setCurrentCard(null);
    this.missionData.set(null);
    this._startNewChat();
  }

  protected onFullScreenClick(): void {
    if (!this.isBrowser) return;
    this.isFullScreen.set(!this.isFullScreen());
    const chatArea = document.querySelector('#khawiik-text-chat__chat-area') as HTMLElement;
    if (!chatArea) return;

    if (!document.fullscreenElement) {
      chatArea.requestFullscreen();
      this.isFullScreen.set(true);
    } else {
      this.isFullScreen.set(false);
      document.exitFullscreen();
    }
  }

  protected openSettingsModal(): void {
    if (!this.isBrowser) return;
    this._modalService.open(KhawiikVoiceTypesComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
        from: 'chat'
      },
      outputs: {
        closed: () => Logger.debug('KhawiikWelcomeComponent | The modal is closed')
      },
      width: '60%',
      minHeight: '30vh',
      maxHeight: '78vh',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => {
        Logger.debug('KhawiikWelcomeComponent | onCloseClick |The modal is closed');
      }
    });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  // return translated day name key
  protected getDayName(day: typeof WEEK_DAYS[0]): string {
    const dayKey = day.dayName.toUpperCase() as keyof typeof this.keys.COMMON.WEEK_DAYS;
    return this.keys.COMMON.WEEK_DAYS[dayKey];
  }

  // prefer the precomputed isToday (SSR-safe)
  protected isToday(day: typeof WEEK_DAYS[0]): boolean {
    return !!day.isToday;
  }

  // ====== Title Editing Functions ======
  protected startEditingTitle(): void {
    this.isEditingTitle.set(true);
    this.editableTitle.set(this.updatedChat()?.name || this.chatTitle());
    this.lastSavedTitle.set(this.updatedChat()?.name || this.chatTitle());
  }

  protected saveTitle(): void {
    const trimmed = this.editableTitle().trim();
    const newTitle = trimmed || 'محادثة جديدة';
    const currentChatId = this.chatSelectedItem()?.id ?? 0;

    this._chatHistoryFacade.editChatName(Number(currentChatId), newTitle).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.lastSavedTitle.set(response.data.name);
          const updatedChatData = {
            ...this.chatSelectedItem()!,
            name: response.data.name
          };

          // Update both updatedChat and chatSelectedItem to ensure consistency
          this.updatedChat.set(updatedChatData);
          this.chatSelectedItem.set(updatedChatData);
          this.chatTitleUpdated.emit(updatedChatData);

          // Update editableTitle to match the saved title
          this.editableTitle.set(response.data.name);
        }
      },
      error: (error) => {
        Logger.error('Failed to save chat title:', error);
      }
    });
  }

  protected resetTitle(): void {
    this.editableTitle.set(this.lastSavedTitle());
    this.isEditingTitle.set(false);
  }

  protected cancelEditTitle(): void {
    this.editableTitle.set(this.lastSavedTitle());
    this.isEditingTitle.set(false);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.saveTitle();
        break;
      case 'Escape':
        this.cancelEditTitle();
        break;
    }
  }

  protected onTitleInputChange(): void {
    // No change needed here
  }

  // ====== Actions Modals ======
  protected _openKhawiikActivitesModal(): void {
    if (!this.isBrowser) return;

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    this._modalService.open(KhawiikActivitesComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        closed: (item: IKhawiikVoiceActivity | null) => {
          Logger.debug('KhawiikTextChatComponent | The modal is closed | item: ', item);
          this._messages.set([]);
          this._startNewChat(item?.slug);

        },
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => {

      }
    });
  }

  protected _openKhawiikHistoryModal(): void {
    if (!this.isBrowser) return;

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.debug('KhawiikTextChatComponent | Opening KhawiikHistory modal');

    const modalRef = this._modalService.open(KhawiikHistoryComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        chatSelected: (item: ChatRecord | null) => {
          Logger.debug('KhawiikTextChatComponent | chatSelected event received | item: ', item);
          if (item && typeof item.id === 'number') {
            Logger.debug('KhawiikTextChatComponent | Loading chat history for ID:', item.id);
            this._loadChatHistory(item);
            this.currentBook.set(null);
            this._khawiikBooksFacade.setCurrentCard(null);
          } else {
            Logger.debug('KhawiikTextChatComponent | No valid chat ID found:', item);
          }
        },
        titleUpdated: (updatedChat: IChatHistoryItemDataDto) => {
          Logger.debug('KhawiikTextChatComponent | titleUpdated event received | updatedChat: ', updatedChat);
          // Update the current chat title if it matches the updated chat
          const currentChat = this.chatSelectedItem();
          if (currentChat && currentChat.id === updatedChat.id) {
            this.chatSelectedItem.set(updatedChat);
            this.updatedChat.set(updatedChat);
            this.lastSavedTitle.set(updatedChat.name);
          }
        }
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikTextChatComponent | onCloseClick | The modal is closed')
    });

    Logger.debug('KhawiikTextChatComponent | Modal opened successfully');
  }

  protected _openKhawiikBooksModal(): void {
    if (!this.isBrowser) return;

    this.refreshLoginStatus();
    if (!this.isLoggedIn()) {
      this._RoleGuardService.openLoginModal();
      return;
    }

    Logger.debug('KhawiikTextChatComponent | Opening KhawiikHistory modal');

    const modalRef = this._modalService.open(KhawiikBooksComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
      },
      outputs: {
        closed: (card: IKhawiikBook | null) => {
          Logger.debug('KhawiikTextChatComponent | closed event received | card: ', card);
          if (card) {
            Logger.debug('KhawiikTextChatComponent | Setting current card:', card.slug);
            // Set the current card in the facade - the subscription will update currentBook automatically
            this._khawiikBooksFacade.setCurrentCard(card);
          }
        },
        chatSelected: (item: ChatRecord | null) => {
          Logger.debug('KhawiikTextChatComponent | chatSelected event received | item: ', item);
          if (item && typeof item.id === 'number') {
            Logger.debug('KhawiikTextChatComponent | Loading chat history for ID:', item.id);
            this._loadChatHistory(item);
          } else {
            Logger.debug('KhawiikTextChatComponent | No valid chat ID found:', item);
          }
        },
        titleUpdated: (updatedChat: IChatHistoryItemDataDto) => {
          Logger.debug('KhawiikTextChatComponent | titleUpdated event received | updatedChat: ', updatedChat);
          // Update the current chat title if it matches the updated chat
          const currentChat = this.chatSelectedItem();
          if (currentChat && currentChat.id === updatedChat.id) {
            this.chatSelectedItem.set(updatedChat);
            this.updatedChat.set(updatedChat);
            this.lastSavedTitle.set(updatedChat.name);
          }
        }
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikTextChatComponent | onCloseClick | The modal is closed')
    });

    Logger.debug('KhawiikTextChatComponent | Modal opened successfully');
  }

  // ====== Private helpers ======
  // Removed _initSubscriptions method as we now rely on conversation state changes through effects

  private _startNewChat(card_slug?: string, doctor_id?: number | string): void {
    if (!this.isBrowser) return;

    this.isNewChatLoading.set(true);
    const payload: IStartNewChatRequestDto = { start: 1 };
    if (card_slug) {
      payload.card_slug = card_slug;
    }
    if (doctor_id) {
      payload.doctor_id = Number(doctor_id);
      Logger.debug('KhawiikTextChat | Starting new chat with doctor_id:', doctor_id);
    }

    this._conversationFacade.startNewChat(payload).subscribe({
      next: (response) => {
        this._messages.set([]);
        Logger.debug('New chat started successfully:', response);
        this.isNewChatLoading.set(false);

        if (response.status && response.data) {
          // Clear existing messages first
          this._messages.set([]);

          // Add bot response message directly to UI
          if (response.data.replay) {
            this._addMessage({
              id: `bot-${Date.now()}`,
              content: response.data.replay,
              timestamp: new Date().toISOString(),
              sender: 'bot',
              type: 'text'
            });
          }

          if (response.data.chat) {
            // Add the newly created chat to the history list in the facade
            this._chatHistoryFacade.addNewChatToHistory(response.data.chat);
            // Update chat selection
            this.chatSelectedItem.set(response.data.chat);
            // Update the updatedChat for title editing
            this.updatedChat.set(response.data.chat);
            this.lastSavedTitle.set(response.data.chat.name);

            // Reset editing state for new chat
            this.isEditingTitle.set(false);
            this.editableTitle.set(response.data.chat.name);
          }
        }
      },
      error: (error) => {
        Logger.error('Failed to start new chat:', error);
        this.isNewChatLoading.set(false);
      }
    });
  }

  private _addMessage(message: ChatMessage): void {
    if (!this.isBrowser) return;
    this._messages.update(messages => [...messages, message]);
    setTimeout(() => this._scrollToBottom(), 100);
  }

  private _scrollToBottom(): void {
    if (!this.isBrowser) return;
    if (this.isBrowser && this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  private _loadChatHistory(chatRecord: ChatRecord): void {
    Logger.debug('KhawiikTextChatComponent | _loadChatHistory called with chatRecord:', chatRecord);

    if (!this.isBrowser) {
      Logger.debug('KhawiikTextChatComponent | Not in browser, returning');
      return;
    }

    // Guard: if this chat was just deleted, do not fetch and reset UI
    const lastDeletedId = this._chatEvents.getLastDeletedId();
    if (lastDeletedId != null && chatRecord?.id === lastDeletedId) {
      Logger.debug('KhawiikTextChatComponent | Selected chat was deleted recently; skipping fetch and resetting state');
      this._conversationFacade.resetStates();
      this._messages.set([]);
      this.missionData.set(null);
      this.updatedChat.set(null);
      this.chatSelectedItem.set(null);
      this.lastSavedTitle.set('محادثة جديدة');
      this.isEditingTitle.set(false);
      return;
    }

    Logger.debug('KhawiikTextChatComponent | Loading chat history for ID:', chatRecord.id);

    // Convert ChatRecord to IChatHistoryItemDataDto format
    const chatData: IChatHistoryItemDataDto = {
      id: chatRecord.id,
      name: chatRecord.name || `محادثة رقم ${chatRecord.id}`,
      created_at: chatRecord.created_at || new Date().toISOString()
    };

    // Update the selected chat item - this will trigger the effect to fetch the conversation
    this.chatSelectedItem.set(chatData);

    Logger.debug('KhawiikTextChatComponent | chatSelectedItem updated, effect will handle fetchConversation');
  }
}
