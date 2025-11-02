import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
  AutoExactHeightDirective,
  CardType,
  StorageService,
  FirestoreService,
  LanguageService,
  Logger,
  IGlobalUserContactInfoModel,
  IGlobalDoctorCopounModel,
  IGlobalMentalHealthScaleModel,
} from '../../../../common';
import {
  ActionsDropdownMenuComponent,
  EmptyStateCardComponent,
  ModalService,
  generateInitials,
  shouldShowImage,
  getAvatarBackgroundColor,
  StorageKeys,
  SvgIconComponent,
} from '../../../../shared';
import {
  ChatMessageTextComponent,
  MessageActionsConfig,
  MeetingChatItemTypes,
  SessionTasksModalComponent,
} from '../../../appointments';
import { ChatMessageImageComponent } from '../../../talbinah-bot';
import { ITechnicalSupportChatDto } from '../../dtos';
import { SupportChatMessagesEmptyState } from '../../configs';
import { Subscription } from 'rxjs';
import { FieldValue, Timestamp } from 'firebase/firestore';

/* ---------- Models ---------- */

export interface ISupportMessageModel {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  fileSize?: any;
  fileName?: any;
  message: string;
  msgType: string;
  eventType?: string | null;
  timestamp:
  | {
    type: string;
    seconds: number;
    nanoseconds: number;
  }
  | Timestamp
  | FieldValue; // keep original union
  msgTime: number;
  is_read: '0' | '1' | '2' | boolean | 0 | 1 | 2;
  replyReference?: any;
}

export interface IUserSummary {
  id: number;
  name: string;
  image?: string | null;
  isSupport: boolean;
}

export interface IUsersObjectData {
  userId?: number;
  supportId?: number;
  userName?: string;
  supportName?: string;
  user: IUserSummary;
  support: IUserSummary;
}

/* ---------- Component ---------- */

@Component({
  selector: 'app-support-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,

    AutoExactHeightDirective,

    ChatMessageImageComponent,
    ChatMessageTextComponent,
    EmptyStateCardComponent,
    SvgIconComponent,
  ],
  templateUrl: './support-messages.component.html',
  styleUrls: ['./support-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportMessagesComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /* DI & platform */
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly _modalService = inject(ModalService);
  private readonly _storageService = inject(StorageService);
  private readonly _firestoreService = inject(FirestoreService);
  protected readonly languageService = inject(LanguageService);

  /* Consts */
  protected readonly currentLang = this.languageService.getCurrentLanguage();
  readonly cardTypes = CardType;
  readonly messageActionsMenuItems = MessageActionsConfig;
  readonly MeetingChatItemsTypes = MeetingChatItemTypes;
  readonly SupportChatMessagesEmptyState = SupportChatMessagesEmptyState;

  /* Inputs/Outputs */
  @Input({ required: false }) currentSupportConversationData: ITechnicalSupportChatDto | null = null;
  @Input() isChatExpanded = signal<boolean>(false);
  @Input() isSupport = false;
  @Output() replyingMessageChanged = new EventEmitter<ISupportMessageModel | null>();

  /* View */
  @ViewChild('chatSupportMessagesList') private chatSupportMessagesListRef?: ElementRef<HTMLUListElement>;

  /* Subscriptions */
  private messagesSub?: Subscription;
  private intersectionObserver?: IntersectionObserver;

  /* Signals */
  readonly messages = signal<ISupportMessageModel[]>([]);
  readonly replyingToMessageContent = signal<ISupportMessageModel | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isNewChatLoading = signal<boolean>(false);
  readonly chatMessagesWithClientId = signal<ISupportMessageModel[]>([]);

  /* Current user */
  protected userInfo!: IGlobalUserContactInfoModel;

  /* Resolved user/support bundle */
  protected usersObjectData!: IUsersObjectData;

  /* Connectivity */
  readonly connectionStatus = computed(() => this._firestoreService.isConnected());

  constructor() {
    // Auto-scroll whenever messages change (preserve behavior)
    effect(() => {
      if (!this.isBrowser) return;
      if (this.messages().length > 0) {
        setTimeout(() => this.scrollToBottom(), 0);
        Logger.debug('📩 New messages detected. Auto scroll triggered.');
      }
    });
  }

  /* ---------- Lifecycle ---------- */

  ngOnInit(): void {
    this.loadStoredUserInfo();
    this.usersObjectData = this.buildUsersObjectData(this.currentSupportConversationData);
    Logger.debug('SupportMessagesComponent | usersObjectData: ', this.usersObjectData);

    this.trySubscribeToMessages('ngOnInit');
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.scrollToBottom();
    this.observeLastMessage();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.messagesSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSupportConversationData']) {
      // rebuild usersObjectData when input changes
      this.usersObjectData = this.buildUsersObjectData(this.currentSupportConversationData);
      Logger.debug('SupportMessagesComponent | usersObjectData (onChanges): ', this.usersObjectData);

      this.trySubscribeToMessages('ngOnChanges');
    }
  }

  /* ---------- Public / Template helpers ---------- */

  protected resolveSender(item: ISupportMessageModel) {
    const isSupport = this.isSameSender(item.senderId, this.usersObjectData.support.id);
    const base = isSupport ? this.usersObjectData.support : this.usersObjectData.user;
    return {
      ...base,
      initials: generateInitials(base.name),
      bgColor: getAvatarBackgroundColor(base.name),
    };
  }

  protected clearReply(): void {
    this.replyingToMessageContent.set(null);
  }

  protected getCouponModel(item: ISupportMessageModel): IGlobalDoctorCopounModel | null {
    return item?.msgType === MeetingChatItemTypes.COUPON && typeof item.message === 'object'
      ? (item.message as IGlobalDoctorCopounModel)
      : null;
  }

  protected scrollToMessage(messageClientId: number | string): void {
    const chatList = this.chatSupportMessagesListRef?.nativeElement;
    if (!chatList) return;
    const target = chatList.querySelector(`[data-message-id="${messageClientId}"]`);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('highlight-message');
    setTimeout(() => target.classList.remove('highlight-message'), 1500);
  }

  protected getMenuItemsForMessage() {
    // returned as-is to keep logic identical
    return [...this.messageActionsMenuItems];
  }

  protected isSameSender(senderId: any, userId: any): boolean {
    return senderId?.toString() === userId?.toString();
  }

  /* ---------- Private helpers ---------- */

  private loadStoredUserInfo(): void {
    const stored = this._storageService.getItem(StorageKeys.CURRENT_USER_INFO) as
      | { user?: IGlobalUserContactInfoModel }
      | null;

    if (stored?.user) {
      this.userInfo = stored.user;
    }
  }

  private buildUsersObjectData(data: ITechnicalSupportChatDto | null): IUsersObjectData {
    return {
      userId: data?.user_id?.id,
      supportId: data?.customer_support_user_id?.id,
      userName: data?.user_id?.full_name,
      supportName: data?.customer_support_user_id?.full_name,
      user: {
        id: data?.user_id?.id ?? 0,
        name: data?.user_id?.full_name ?? '',
        image: data?.user_id?.image ?? null,
        isSupport: false,
      },
      support: {
        id: data?.customer_support_user_id?.id ?? 0,
        name: data?.customer_support_user_id?.full_name ?? '',
        image: data?.customer_support_user_id?.image ?? null,
        isSupport: true,
      },
    };
  }

  /** Subscribe to Firestore messages stream if there is a valid conversation id. */
  private trySubscribeToMessages(from: 'ngOnInit' | 'ngOnChanges'): void {
    if (!this.isBrowser) return;

    const conversationId = this.currentSupportConversationData?.id;
    if (!conversationId) {
      Logger.warn(`[${from}] No conversation ID. Clearing messages.`);
      this.messages.set([]);
      this.loading.set(false);
      this.messagesSub?.unsubscribe();
      return;
    }

    Logger.debug(`[${from}] Subscribing to messages for conversation ID:`, conversationId);

    // Avoid duplicate subscriptions
    this.messagesSub?.unsubscribe();
    this.loading.set(true);

    this.messagesSub = this._firestoreService
      .getTechSupportMessages(String(conversationId), String(this.userInfo?.id))
      .subscribe({
        next: (msgs) => {
          Logger.debug('SupportMessagesComponent | messages fetched length:', msgs?.length ?? 0);
          this.messages.set(msgs ?? []);
          Logger.debug('SupportMessagesComponent | messages fetched:', msgs ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          Logger.error('SupportMessagesComponent | failed to load messages:', err);
          this.messages.set([]);
          this.loading.set(false);
        },
      });
  }

  private scrollToBottom(): void {
    const chatList = this.chatSupportMessagesListRef?.nativeElement;
    if (!chatList) return;
    chatList.scrollTop = chatList.scrollHeight;
  }

  private observeLastMessage(): void {
    const chatList = this.chatSupportMessagesListRef?.nativeElement;
    if (!chatList) return;

    this.intersectionObserver?.disconnect();

    const lastMessage = chatList.querySelector('.chat-messages__item:last-child');
    if (!lastMessage) return;

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Logger.debug('End of messages reached');
        }
      },
      { root: chatList, threshold: 0.1 }
    );

    this.intersectionObserver.observe(lastMessage);
  }
}
