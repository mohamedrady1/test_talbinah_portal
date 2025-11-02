import { updateDoc } from '@angular/fire/firestore';
import { FileType, FileViewerComponent, ChatMessageImageComponent, PodcastBotComponent, ChatMessageVoiceComponent } from "../../../talbinah-bot";
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, PLATFORM_ID, signal, ViewChild, SimpleChanges, Signal } from '@angular/core';
import { CardType, StorageService, Logger, IGlobalDoctorCopounModel, AutoExactHeightDirective, LanguageService, IGlobalMentalHealthScaleModel } from '../../../../common';
import { ModalService, StorageKeys, ActionsDropdownMenuComponent, IActionDropdownMenuItem, SvgIconComponent, EmptyStateCardComponent } from '../../../../shared';
import { ChatDoctorCardComponent } from "../../../talbinah-bot/components/chat-doctor-card";
import { DiscountCardForMeetingChatComponent } from "../discount-card-for-meeting-chat";
import { CardComponent, MentalHealthScaleCardComponent } from "../../../mental-health-scales";
import { BookApoointmentPopupComponent } from '../../../book-appointment';
import { SessionTasksModalComponent } from "../session-tasks-modal";
import { ReferencedMessageComponent } from "../referenced-message";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DownloadableFile } from '../../../talbinah-bot/models';
import { IGlobalReservationModel, IUser } from '../../models';
import { ArticleCardComponent } from "../../../articles";
import { TranslateModule } from '@ngx-translate/core';
import { MessageActionsConfig, ChatMessagesEmptyState } from "../../configs";
import { MeetingChatItemTypes } from '../../enums';
import { IMeetingChatItem } from '../../dtos';
import { FormsModule } from '@angular/forms';
import { ChatMessageTextComponent } from "../chat-message-text";
import { FirestoreService, ReservationModel } from "../../../../common/core/services/firestore.service";
import { generateInitials, shouldShowImage, getAvatarBackgroundColor } from '../../../../shared';
import { PodcastCardForMeetingChatComponent } from '../podcast-card-for-meeting-chat';
import { ChatMessageVideoComponent } from '../../../talbinah-bot/components/chat-message-video';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-chat-meeting-messages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    AutoExactHeightDirective,
    FileViewerComponent,
    ChatMessageVideoComponent,
    ChatMessageImageComponent,
    ChatDoctorCardComponent,
    PodcastBotComponent,
    ArticleCardComponent,
    CardComponent,
    DiscountCardForMeetingChatComponent,
    MentalHealthScaleCardComponent,
    ActionsDropdownMenuComponent,
    ReferencedMessageComponent,
    ChatMessageVoiceComponent,
    SvgIconComponent,
    ChatMessageTextComponent,
    EmptyStateCardComponent,
    PodcastCardForMeetingChatComponent,
    
  ],
  templateUrl: './chat-meeting-messages.component.html',
  styleUrls: ['./chat-meeting-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMeetingMessagesComponent implements AfterViewInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _modalService = inject(ModalService);
  readonly cardTypes = CardType;
  readonly messageActionsMenuItems = MessageActionsConfig;
  protected userInfo!: IUser;

  private _StorageService = inject(StorageService);
  protected sessionDate: Date | string | null = null;

  readonly connectionStatus = computed(() => 'offline');

  readonly loading = signal(true);

  private readonly _FirestoreService = inject(FirestoreService);

  // Computed properties for avatar fallback
  public doctorInitials = computed(() =>
    generateInitials(this.currentReservationData?.doctor?.full_name)
  );

  public shouldShowDoctorImage = computed(() =>
    shouldShowImage(this.currentReservationData?.doctor?.image)
  );

  public doctorAvatarBackgroundColor = computed(() =>
    getAvatarBackgroundColor(this.currentReservationData?.doctor?.full_name)
  );

  public userInitials = computed(() =>
    generateInitials(this.userInfo?.full_name)
  );

  public shouldShowUserImage = computed(() =>
    shouldShowImage(this.userInfo?.image)
  );

  public userAvatarBackgroundColor = computed(() =>
    getAvatarBackgroundColor(this.userInfo?.full_name)
  );

  @Input({ required: false }) currentReservationData: IGlobalReservationModel | null = null;
  @Input() isChatExpanded = signal<boolean>(false);

  readonly MeetingChatItemsTypes: any = MeetingChatItemTypes;

  readonly isNewChatLoading = signal<boolean>(false);

  readonly chatMessagesEmptyState = ChatMessagesEmptyState;

  @ViewChild('chatMessagesList') private chatMessagesListRef?: ElementRef<HTMLUListElement>;

  private intersectionObserver?: IntersectionObserver;

  readonly chatMessagesWithClientId = signal<IMeetingChatItem[]>([]);
  readonly replyingToMessageContent = signal<IMeetingChatItem | null>(null);
  // Output: Emits when the replyingToMessageContent signal changes

  @Output() replyingMessageChanged = new EventEmitter<IMeetingChatItem | null>();


  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.getCurrentLanguage();

  protected reservationModel!: ReservationModel;

  // Firebase Configs
  protected readonly firestore = inject(FirestoreService);
  readonly reservation = computed(() => ({
    doctor: { id: this.currentReservationData?.doctor?.id ?? '' },
    user: { id: this.currentReservationData?.user?.id ?? '' }
  }));

  messages = signal<any[]>([]);

  constructor() {
    effect(() => {
      const messages = this.messages();

      if (messages?.length && this.isBrowser) {
        setTimeout(() => this.scrollToBottom(), 0);
        Logger.debug('📩 New messages detected. Auto scroll to bottom.');
      }
    });

  }

  protected openPopup(): void {
    this._modalService.open(BookApoointmentPopupComponent, {
      inputs: {
        image: 'images/home/icons/bot.png',
        title: 'book_appointment_page_title',
        subtitle: 'book_appointment_page_subtitle'
      },
      outputs: {
        closed: () => {
          console.log('The modal is closed');
        }
      }
    });
  }

  ngOnInit(): void {
    const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IUser } | null;
    if (storedUserInfo && storedUserInfo.user) {
      this.userInfo = storedUserInfo.user;
      // Logger.warn('User info found in storage:', {
      //   userId: this.userInfo?.id,
      //   doctorId: this.currentReservationData?.doctor?.id
      // });
    } else {
      // Logger.warn('No user info found in storage.');
    }

    Logger.debug('Data: ', {
      userId: this.currentReservationData?.user?.id,
      doctorId: this.currentReservationData?.doctor?.id
    })

    this.sessionDate = this.currentReservationData?.created_at ?? new Date();
    this.reservationModel = {
      doctor: { id: this.currentReservationData?.doctor?.id ?? '' },
      user: { id: this.currentReservationData?.user?.id ?? '' }
    };

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

  public scrollToBottom(): void {
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

  protected getDownloadableFile(item: IMeetingChatItem): DownloadableFile | null {
    if (item) {
      let FileTypeValue: string | any = FileType.PDF;
      if (item.msgType == MeetingChatItemTypes.VIEW_PDF || item.msgType == MeetingChatItemTypes.VIEW_PDF_ALT || item.msgType == MeetingChatItemTypes.DOCUMENT) {
        FileTypeValue = FileTypeValue;
      }
      return {
        name: item.fileName || this.extractFileNameFromUrl(item.message) || 'document',
        url: item?.message || '',
        type: FileTypeValue,
        size: item?.fileSize ?? 0,
        date: item.msgTime ? new Date(item.msgTime) : undefined
      };
    } else {
      return null;
    }
  }
  private extractFileNameFromUrl(url: string | null | any): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const lastSlashIndex = pathname.lastIndexOf('/');
      if (lastSlashIndex > -1) {
        let fileName = pathname.substring(lastSlashIndex + 1);
        const queryIndex = fileName.indexOf('?');
        if (queryIndex > -1) {
          fileName = fileName.substring(0, queryIndex);
        }
        return fileName || null;
      }
    } catch (e) {
      console.error("Invalid URL for file name extraction:", url, e);
    }
    return null;
  }

  protected handleMenuItemClick(item: IActionDropdownMenuItem, message: IMeetingChatItem): void {
    Logger.debug('handleMenuItemClick →', { item, message });

    if (item.action === 'replay-massege') {
      this.replyingToMessageContent.set(message);
      this.replyingMessageChanged.emit(this.replyingToMessageContent());
      Logger.debug('Reply mode set:', {
        replyingToMessageContent: this.replyingToMessageContent()
      });
      return;
    }

    if (item.action === 'delete-message') {
      Logger.debug('Delete mode set');
      this.onDeleteMessage(message?.msgTime);
      return;
    }

    if (item.action === 'copy-massege') {
      Logger.debug('Copy mode set:',);
      return;
    }

    Logger.info(`Action '${item.action}' clicked, but not configured to open a modal.`);
  }

  async onDeleteMessage(msgTime: number): Promise<void> {
    const reservationData = this.reservation();
    if (!reservationData) {
      console.error('No reservation data found');
      return;
    }

    const messageToDelete = {
      senderId: this.currentReservationData?.user?.id?.toString() ?? '',
      message: 'Deleted',
      msgTime,
      msgType: MeetingChatItemTypes.DELETED
    };

    await this._FirestoreService.deleteMessage(reservationData, messageToDelete);
  }

  // New method to clear the reply
  protected clearReply(): void {
    this.replyingToMessageContent.set(null); // This also triggers the new effect
  }

  protected getCouponModel(item: IMeetingChatItem): IGlobalDoctorCopounModel | null {
    if (item?.msgType === MeetingChatItemTypes.COUPON && item.message && typeof item.message === 'object') {
      return item.message as IGlobalDoctorCopounModel;
    }
    return null;
  }

  protected scrollToMessage(messageClientId: number | any): void {
    Logger.debug('scrollToMessage: messageClientId:- ', messageClientId);

    if (!this.isBrowser || !this.chatMessagesListRef) return;

    const chatList = this.chatMessagesListRef.nativeElement;
    const targetMessageElement = chatList.querySelector(`[data-message-id="${messageClientId}"]`);

    if (targetMessageElement) {
      targetMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetMessageElement.classList.add('highlight-message');
      setTimeout(() => targetMessageElement.classList.remove('highlight-message'), 1500);
      Logger.debug(`Scrolled to message with clientId: ${messageClientId}`);
    } else {
      Logger.warn(`Message with clientId: ${messageClientId} not found to scroll to.`);
    }
  }

  protected onOpenChatTasksModal(): void {
    let componentToOpen: any;
    let modalInputs: any = {};
    let modalOutputs: any = {};
    let modalWidth: string = '50%';

    const currentReservationData = this.currentReservationData;

    componentToOpen = SessionTasksModalComponent;
    modalInputs = {
      image: 'images/modals-icons/tasks.png',
      title: 'session_tasks',
      subtitle: 'session_tasks_modal_subtitle',
      doctor: currentReservationData?.doctor,
      session: currentReservationData,
      type: 'session'
    };
    modalOutputs = {
      closed: () => {
        Logger.debug('Session Tasks modal closed.');
      },
    };

    this._modalService.open(componentToOpen, {
      inputs: modalInputs,
      outputs: modalOutputs,
      width: modalWidth,
    });
  }

  protected isMentalHealthScaleMessage(msg: any): msg is IGlobalMentalHealthScaleModel {
    return msg && typeof msg === 'object' && 'title' in msg;
  }
  protected isDoctorCopounMessage(msg: any): msg is IGlobalDoctorCopounModel {
    return msg && typeof msg === 'object' && 'discount' in msg && 'type' in msg;
  }

  protected parseJson<T = any>(msg: unknown): T | null {
    if (typeof msg === 'object' && msg !== null) {
      return msg as T;
    }

    if (typeof msg === 'string') {
      try {
        const parsed = JSON.parse(msg);
        // Logger.debug('✅ Parsed JSON:', parsed);
        return parsed as T;
      } catch (error) {
        Logger.error('❌ Failed to parse JSON:', error, msg);
        return null;
      }
    }

    Logger.warn('⚠️ Unsupported input to parseJson:', msg);
    return null;
  }

  getMenuItemsForMessage(item: any) {
    const items = [...this.messageActionsMenuItems];
    if (item.senderId == this.currentReservationData?.doctor?.id) {
      items.splice(2, 1);
    }
    return items;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['currentReservationData'] &&
      this.currentReservationData &&
      this.currentReservationData.doctor?.id &&
      this.currentReservationData.user?.id
    ) {
      this.firestore.getMessages({
        doctor: { id: '' + this.currentReservationData.doctor.id },
        user: { id: '' + this.currentReservationData.user.id }
      }, String(this.userInfo?.id)).subscribe(messages => {
        console.log(messages)
        this.messages.set(messages ?? []);
      });
    }
  }

  protected onImageError(event: Event, gender?: number | null): void {
    const img = event.target as HTMLImageElement;

    // gender: 1 = female, else male
    // const fallbackSrc =
    //   gender === 1
    //     ? 'images/not-found/no-woman-doctor.svg'
    //     : 'images/not-found/no-doctor.svg';

    const fallbackSrc =
      gender === 1
        ? 'images/icons/logo-2.png'
        : 'images/icons/logo-2.png';

    img.src = fallbackSrc;
  }
}

