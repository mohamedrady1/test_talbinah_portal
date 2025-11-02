import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
  effect,
  WritableSignal,
  Signal,
  ChangeDetectorRef,
  computed, // Import computed
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAnswer, Question } from '../../models';
import { mockTalbinahBot } from '../../data';
import { CardType, Logger, StorageService } from '../../../../common';
import { IChatHistoryItemDataDto, IStartNewChatRequestDto, ITalbinahBotResponseDto } from '../../dtos';
import { TalbinahItemType } from '../../enums';
import { PodcastBotComponent } from '../podcast-bot';
import { ChatMessageVideoComponent } from '../chat-message-video';
import { FileViewerComponent } from '../file-viewer';
import { ChatDoctorCardComponent } from '../chat-doctor-card/chat-doctor-card.component';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { ChatAnswersCardComponent } from '../chat-answers-card';
import { ChatQuestionsCardComponent } from '../chat-questions-card';
import { ChatHistoryFacade, ConversationFacade } from '../../services';
import { ChatEventsService } from '../../services/chat-events.service';
import { ModalService, StorageKeys } from '../../../../shared';
import { ArticleCardComponent } from "../../../articles/components/article-card/article-card.component";
import { ChatMessageImageComponent } from '../chat-message-image';
import { IUser } from '../../../authentication';
import { ChatInputComponent } from "../chat-input/chat-input.component";
import { PodcastCardComponent } from '../../../podcasts';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    PodcastBotComponent,
    ChatMessageImageComponent,
    ChatMessageVideoComponent,
    FileViewerComponent,
    AutoExactHeightDirective,
    ChatQuestionsCardComponent,
    ChatAnswersCardComponent,
    ArticleCardComponent,
    ChatDoctorCardComponent,
    PodcastCardComponent
  ],
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  protected updatedChat!: IChatHistoryItemDataDto;
  readonly cardTypes = CardType;
  protected userInfo!: IUser;
  private _StorageService = inject(StorageService);
  private readonly _ChatHistoryFacade = inject(ChatHistoryFacade);

  readonly isEditingNameLoading = this._ChatHistoryFacade.isEditingNameLoading;
  readonly editNameStatus = this._ChatHistoryFacade.status;

  private readonly _ConversationFacade = inject(ConversationFacade);

  readonly currentConversation = this._ConversationFacade.currentConversation;
  readonly isConversationLoading = this._ConversationFacade.isConversationLoading;
  readonly conversationStatus = this._ConversationFacade.conversationStatus;
  readonly conversationErrorMessage = this._ConversationFacade.conversationErrorMessage;

  readonly isEditingTitle = signal(false);
  @Input() chatSelectedItem = signal<IChatHistoryItemDataDto | null>(null);
  @Output() chatTitleUpdated = new EventEmitter<IChatHistoryItemDataDto>();

  readonly chatTitle = computed(() => {
    return this.chatSelectedItem()?.name ?? 'عنوان الشات';
  });

  readonly editableTitle = signal<string>('عنوان الشات');
  readonly lastSavedTitle = signal<string>('عنوان الشات');

  readonly TalbinahItemTypes = TalbinahItemType;
  readonly messageResponse = signal<ITalbinahBotResponseDto>(mockTalbinahBot);

  // New signal for new chat loading state
  readonly isNewChatLoading = signal<boolean>(false);


  @ViewChild('chatMessagesList') private chatMessagesListRef?: ElementRef<HTMLUListElement>;

  private intersectionObserver?: IntersectionObserver;
  private readonly _chatEvents = inject(ChatEventsService);

  constructor() {
    // Listen for rename events and update title if current chat matches
    this._chatEvents.titleUpdated$.subscribe(evt => {
      const selectedItem = this.chatSelectedItem();
      if (evt && selectedItem && selectedItem.id === evt.id) {
        this.editableTitle.set(evt.name);
        this.lastSavedTitle.set(evt.name);
      }
    });
    effect(() => {
      const selectedItem = this.chatSelectedItem();
      if (selectedItem && selectedItem.id != null) {
        Logger.debug(`ChatMessagesComponent: chatSelectedItem changed, fetching conversation ID: ${selectedItem.id}`);
        this._ConversationFacade.fetchConversation(selectedItem.id as number);
        this.lastSavedTitle.set(selectedItem.name ?? 'عنوان الشات');
        // Reset updatedChat when chatSelectedItem changes
        this.updatedChat = { ...selectedItem }; // You can set it to a copy of selectedItem or null/empty object depending on your exact needs

        // Reset editing state when switching chats
        this.isEditingTitle.set(false);
        this.editableTitle.set(selectedItem.name ?? 'عنوان الشات');
      } else {
        Logger.debug('ChatMessagesComponent: chatSelectedItem is null or has no ID, resetting conversation state.');
        this._ConversationFacade.resetStates();
        this.lastSavedTitle.set('عنوان الشات');
        this.updatedChat = {} as IChatHistoryItemDataDto; // Reset to an empty object

        // Reset editing state when no chat is selected
        this.isEditingTitle.set(false);
        this.editableTitle.set('عنوان الشات');
      }
    });

    effect(() => {
      const messages = this.currentConversation();
      if (messages && messages.length > 0) {
        if (this.isBrowser) {
          setTimeout(() => {
            this.scrollToBottom();
            this.observeLastMessage();
          }, 0);
        }
      }
    });

    effect(() => {
      if (!this.isEditingNameLoading() && this.editNameStatus()) {
        this.isEditingTitle.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.scrollToBottom();
      this.observeLastMessage();
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  private scrollToBottom(): void {
    const chatList = this.chatMessagesListRef?.nativeElement;
    if (chatList) {
      chatList.scrollTop = chatList.scrollHeight;
      Logger.debug('Scrolled to bottom of chat messages list.');
    }
  }

  private observeLastMessage(): void {
    if (!this.isBrowser || !this.chatMessagesListRef) return;

    this.intersectionObserver?.disconnect();

    const chatList = this.chatMessagesListRef.nativeElement;
    const lastMessage = chatList.querySelector('.chat-messages__item:last-child');
    if (!lastMessage) {
      Logger.debug('No last message found to observe yet.');
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Logger.debug('Reached end of messages — consider loading more.');
        }
      },
      { root: chatList, threshold: 0.1 }
    );

    this.intersectionObserver.observe(lastMessage);
    Logger.debug('Observing new last message.');
  }

  protected startEditingTitle(): void {
    this.isEditingTitle.set(true);
    this.editableTitle.set(this.updatedChat?.name || this.chatTitle());
    this.lastSavedTitle.set(this.updatedChat?.name || this.chatTitle());
  }

  protected saveTitle(): void {
    const trimmed = this.editableTitle().trim();
    const newTitle = trimmed || 'عنوان الشات';
    const currentChatId = this.chatSelectedItem()?.id ?? 0;

    this._ChatHistoryFacade.editChatName(Number(currentChatId), newTitle).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.lastSavedTitle.set(response.data.name);
          const updatedChatData = {
            ...this.chatSelectedItem()!,
            name: response.data.name
          };

          // Update both updatedChat and chatSelectedItem to ensure consistency
          this.updatedChat = updatedChatData;
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

  protected newChatHandler(): void {
    Logger.debug('New Chat initiated.');
    this.isNewChatLoading.set(true); // Set loading to true
    const request: IStartNewChatRequestDto = { start: 1 };
    this._ConversationFacade.startNewChat(request).subscribe({
      next: (response) => {
        Logger.debug('New chat started successfully:', response);
        this.isNewChatLoading.set(false); // Set loading to false on success

        if (response.status && response.data?.chat) {
          // Add the newly created chat to the history list in the facade
          this._ChatHistoryFacade.addNewChatToHistory(response.data.chat);
          // Also, if this new chat should be automatically selected, update chatSelectedItem
          this.chatSelectedItem.set(response.data.chat);

          // Reset editing state for new chat
          this.isEditingTitle.set(false);
          this.editableTitle.set(response.data.chat.name);
          this.lastSavedTitle.set(response.data.chat.name);
        }
      },
      error: (error) => {
        Logger.error('Failed to start new chat:', error);
        this.isNewChatLoading.set(false); // Set loading to false on error
      }
    });
  }

  questions: Question[] = [
    {
      id: 1,
      text: 'ما عاصمة مصر؟',
      answers: [
        { id: 1, text: 'القاهرة' },
        { id: 2, text: 'الإسكندرية' },
        { id: 3, text: 'الرياض' },
      ],
    },
    {
      id: 2,
      text: 'ما أكبر كوكب في المجموعة الشمسية؟',
      answers: [
        { id: 4, text: 'الأرض' },
        { id: 5, text: 'المشتري' },
        { id: 6, text: 'زحل' },
      ],
    },
  ];

  visibleQuestions = signal<number>(1);
  selectedAnswers = signal<(IAnswer & { questionId: number })[]>([]);

  onSelectAnswer(questionId: number, selected: IAnswer) {
    const current = this.selectedAnswers();
    const updated = current.filter(a => a.questionId !== questionId);
    this.selectedAnswers.set([...updated, { ...selected, questionId }]);

    if (this.visibleQuestions() < this.questions.length) {
      this.visibleQuestions.set(this.visibleQuestions() + 1);
    } else {
      console.log('✅ انتهى الاختبار:', this.selectedAnswers());
    }
  }

  getSelectedId(questionId: number): number | null {
    return this.selectedAnswers().find(a => a.questionId === questionId)?.id ?? null;
  }

  ngOnInit() {
    const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IUser } | null;
    if (storedUserInfo && storedUserInfo.user) {
      this.userInfo = storedUserInfo.user;
    } else {
      // Logger.warn('No user info found in storage.');
    }
  }
}
