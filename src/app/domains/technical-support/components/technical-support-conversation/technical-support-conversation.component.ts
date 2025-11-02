import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  inject,
  computed,
  signal,
  PLATFORM_ID
} from '@angular/core';
import { ActionsDropdownMenuComponent, IActionDropdownMenuItem, ModalService, StorageKeys } from "../../../../shared";
import { AutoExactHeightDirective, EventType, FirestoreService, Logger, SupportConversationModel } from '../../../../common';
import { ISupportMessageModel, SupportMessagesComponent } from "../support-messages";
import { CloseSupportConversationComponent } from '../close-support-conversation';
import { IGlobalUserContactInfoModel, StorageService } from '../../../../common';
import { AssignToCustomerSupportComponent } from '../assign-to-customer-support';
import { ChatMeetingMessagesSkeletonComponent } from '../../../appointments';
import { TechnicalSupportConversationDetailsFacade } from '../../services';
import { TransferToDepartmentComponent } from '../transfer-to-department';
import { SupportMessageInputComponent } from "../support-message-input";
import { IUserData, UserContextService } from '../../../authentication';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChatSupportActionsMenuItemsConfig } from '../../configs';
import { ITechnicalSupportChatDto } from '../../dtos';

@Component({
  selector: 'app-technical-support-conversation',
  standalone: true,
  imports: [
    CommonModule,
    AutoExactHeightDirective,
    ChatMeetingMessagesSkeletonComponent,
    ActionsDropdownMenuComponent,
    SupportMessageInputComponent,
    SupportMessagesComponent
  ],
  templateUrl: './technical-support-conversation.component.html',
  styleUrls: ['./technical-support-conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalSupportConversationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) data: { chatItem: ITechnicalSupportChatDto | null } = { chatItem: null };
  @Output() closed = new EventEmitter<void>();

  private readonly _modalService = inject(ModalService);
  private readonly _conversationDetailsFacade = inject(TechnicalSupportConversationDetailsFacade);
  private readonly _firestoreService = inject(FirestoreService);
  private readonly _UserContextService = inject(UserContextService);
  private readonly _StorageService = inject(StorageService);
  private readonly _platformId = inject(PLATFORM_ID);

  readonly details = this._conversationDetailsFacade.details;
  readonly isLoading = this._conversationDetailsFacade.isLoading;
  readonly errorMessage = this._conversationDetailsFacade.errorMessage;

  protected chatSupportActionsMenuItems: IActionDropdownMenuItem[] = ChatSupportActionsMenuItemsConfig;
  protected messages = computed(() => this.details() || []);

  protected readonly isSupport = signal(false);
  private userInfo!: IGlobalUserContactInfoModel | null;

  readonly replyingToSupportMessageContent = signal<ITechnicalSupportChatDto | null>(null);

  ngOnInit(): void {
    Logger.debug('TechnicalSupportConversationComponent | chatItem: ', this.data.chatItem);

    if (!this.data.chatItem) {
      Logger.warn('No chatItem provided, closing conversation modal');
      this.onClose();
      return;
    }

    this._conversationDetailsFacade.fetchConversationDetails(this.data.chatItem.id);

    const isSupportFlag = this.getStoredUser()?.user?.is_support ?? false;
    this.isSupport.set(isSupportFlag);

    const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as
      | { user?: IGlobalUserContactInfoModel }
      | null;
    this.userInfo = storedUserInfo?.user ?? null;
  }

  ngOnDestroy(): void {
    this._conversationDetailsFacade.resetState();
    this.closed.complete();
    this.closed.unsubscribe();
  }

  protected onClose(): void {
    this.closed.emit();
  }

  protected refreshConversation(): void {
    if (this.data.chatItem) {
      this._conversationDetailsFacade.fetchConversationDetails(this.data.chatItem.id);
    }
  }

  protected handleMenuItemClick(item: IActionDropdownMenuItem, message: ITechnicalSupportChatDto | null): void {
    Logger.debug('handleMenuItemClick →', { item, message });
    if (item?.action == 'assignTo') return this.openAssignToCustomerModal();
    if (item?.action == 'transferTo') return this.openTransferToDepartmentModal();
    if (item?.action == 'closeConversation') return this.openCloseConversationModal();

    Logger.info(`Action '${item.action}' clicked, but not configured to open a modal.`);
  }

  private getReceiverId(): string {
    if (!this.details()) return '';
    return this.isSupport()
      ? this.details()?.user_id?.toString() ?? ''
      : this.details()?.customer_support_user_id?.toString() ?? '';
  }

  private openAssignToCustomerModal(): void {
    this._modalService.open(AssignToCustomerSupportComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'assign_to',
        data: { chatItem: this.details(), isSupport: this.isSupport() }
      },
      outputs: {
        closed: async (res: { isRequestSuccessed?: boolean, assignedToName?: string } | void) => {
          if (res?.isRequestSuccessed && this.userInfo && this.details()) {
            try {
              const conversationId = String(this.details()?.id);
              const conversationModel: SupportConversationModel = {
                sender_id: this.userInfo.id,
                receiver_id: Number(this.getReceiverId()),
                conversation_id: Number(conversationId)
              };

              const payload: Omit<ISupportMessageModel, 'id' | 'timestamp'> = {
                senderId: this.userInfo.id.toString(),
                senderName: this.userInfo.full_name ?? 'مستخدم',
                senderImage: this.userInfo.image ?? '',
                message: res.assignedToName ?? 'مستخدم آخر',
                msgType: 'event',
                eventType: EventType.assigned,
                is_read: '0',
                msgTime: Date.now(),
              };

              await this._firestoreService.sendSupportEvent(
                conversationModel,
                this.details(),
                EventType.assigned,
                payload
              );
            } catch (err) {
              Logger.error('Failed to send assigned event', err);
            }
            this.closed.emit();
          }
        }
      },
      width: "40%"
    });
  }

  private openTransferToDepartmentModal(): void {
    this._modalService.open(TransferToDepartmentComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'transfer_to',
        data: { chatItem: this.details(), isSupport: this.isSupport() }
      },
      outputs: {
        closed: async (res: { isRequestSuccessed?: boolean, departmentName?: string } | void) => {
          if (res?.isRequestSuccessed && this.userInfo) {
            try {
              const conversationId = String(this.details()?.id);
              const conversationModel: SupportConversationModel = {
                sender_id: this.userInfo.id,
                receiver_id: Number(this.getReceiverId()),
                conversation_id: Number(conversationId)
              };

              const payload: Omit<ISupportMessageModel, 'id' | 'timestamp'> = {
                senderId: this.userInfo.id.toString(),
                senderName: this.userInfo.full_name ?? 'مستخدم',
                senderImage: this.userInfo.image ?? '',
                // receiverId: this.getReceiverId(),
                message: res.departmentName ?? 'قسم الدعم',
                msgType: 'event',
                eventType: EventType.transferred,
                is_read: '0',
                msgTime: Date.now(),
              };
              await this._firestoreService.sendSupportEvent(
                conversationModel,
                this.details(),
                EventType.transferred,
                payload
              );
            } catch (err) {
              Logger.error('Failed to send transferred event', err);
            }
            this.closed.emit();
          }
        }
      },
      width: "40%"
    });
  }

  private openCloseConversationModal(): void {
    this._modalService.open(CloseSupportConversationComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'end_conversation',
        data: { chatItem: this.details(), isSupport: this.isSupport() }
      },
      outputs: {
        closed: async (res: { isRequestSuccessed?: boolean } | void) => {
          if (res?.isRequestSuccessed && this.userInfo) {
            try {
              const conversationId = String(this.details()?.id);
              const conversationModel: SupportConversationModel = {
                sender_id: this.userInfo.id,
                receiver_id: Number(this.getReceiverId()),
                conversation_id: Number(conversationId)
              };

              const payload: Omit<ISupportMessageModel, 'id' | 'timestamp'> = {
                senderId: this.userInfo.id.toString(),
                senderName: this.userInfo.full_name ?? 'مستخدم',
                senderImage: this.userInfo.image ?? '',
                // receiverId: this.getReceiverId(),
                message: '',
                msgType: 'event',
                eventType: EventType.ended,
                is_read: '0',
                msgTime: Date.now(),
              };
              await this._firestoreService.sendSupportEvent(
                conversationModel,
                this.details(),
                EventType.ended,
                payload
              );
            } catch (err) {
              Logger.error('Failed to send ended event', err);
            }
            this.closed.emit();
          }
        }
      },
      width: "40%"
    });
  }

  private getStoredUser(): IUserData | null {
    if (!isPlatformBrowser(this._platformId)) return null;
    try {
      return this._UserContextService.user() ?? null;
    } catch {
      return null;
    }
  }

  protected handleReplyingSupportMessageChange(item: ITechnicalSupportChatDto | null): void {
    this.replyingToSupportMessageContent.set(item);
  }

  protected clearReply(): void {
    this.replyingToSupportMessageContent.set(null);
  }
}
