import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FileAttachment } from '../../../appointments/models';
import { ITechnicalSupportChatDto } from '../../dtos';
import { FirestoreService, IGlobalUserContactInfoModel, Logger, StorageService, SupportConversationModel } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { StorageKeys, SvgIconComponent } from '../../../../shared';
import { SupportChatItemTypes } from '../../enums';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  UploadAttachmentsMenuSelectorComponent,
  UploadAttachmentsFacade,
  IUploadedFileMetadata
} from '../../../appointments';
import { ISupportMessageModel } from '../support-messages';

@Component({
  selector: 'app-support-message-input',
  standalone: true,
  imports: [
    SvgIconComponent,
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule,
    UploadAttachmentsMenuSelectorComponent,
  ],
  templateUrl: './support-message-input.component.html',
  styleUrls: ['./support-message-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportMessageInputComponent {
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _uploads = inject(UploadAttachmentsFacade);
  readonly isUploading = this._uploads.isUploading;
  readonly uploadError = this._uploads.uploadError;
  readonly uploadResponse = this._uploads.uploadedFilesResponse;
  readonly uploadedFilesMetadata = this._uploads.uploadedFilesMetadata;

  private readonly _firestoreService = inject(FirestoreService);

  @Input() currentSupportConversation: ITechnicalSupportChatDto | null = null;
  @Input() isSupport: boolean = false;

  // User info
  protected userInfo!: IGlobalUserContactInfoModel;
  private readonly _StorageService = inject(StorageService);

  @ViewChild('uploadAttachmentsMenuSelectorRef')
  private attachmentMenu!: UploadAttachmentsMenuSelectorComponent;

  readonly message = signal('');
  readonly selectedSupportFiles = signal<FileAttachment[]>([]);
  readonly isMessageSupportSending = signal(false);
  readonly showAttachmentMenu = signal(false);

  readonly isSupportSendDisabled = computed(() =>
    this.isMessageSupportSending() ||
    (!this.message().trim() && !this.selectedSupportFiles().length)
  );

  protected updateMessage = (evt: Event) => {
    const inputElement = evt.target as HTMLInputElement;
    this.message.set(inputElement?.value ?? '');
  };

  constructor() {
    this.setupUploadFilesEffect();
  }

  ngOnInit(): void {
    const storedUserInfo = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as
      | { user?: IGlobalUserContactInfoModel }
      | null;

    if (storedUserInfo?.user) {
      this.userInfo = storedUserInfo.user;
    }
  }

  /** ✅ Send text message */
  protected async sendTextMessage(evt: Event) {
    evt.preventDefault();
    const text = this.message().trim();

    if (!text && !this.selectedSupportFiles().length) return;

    if (text) {
      const messagePayload: Omit<ISupportMessageModel, 'id' | 'timestamp'> = {
        senderId: this.userInfo?.id?.toString() ?? '',
        senderName: this.currentSupportConversation?.user_id?.full_name ?? 'مستخدم',
        senderImage: this.currentSupportConversation?.user_id?.image ?? '',
        message: text,
        msgType: SupportChatItemTypes.TEXT,
        is_read: '0',
        msgTime: Date.now(),
        replyReference: null
      };

      this._firestoreService.sendSupportMessage(
        this.getConversationObject(),
        messagePayload,
        this.currentSupportConversation,
        this.isSupport
      );
    }

    this.resetSupportInput();
  }

  /** ✅ Handle selected files */
  protected async handleFilesSelected(fileList: FileList | null, fileType: string) {
    if (!isPlatformBrowser(this._platformId) || !fileList?.length) return;
    const files: File[] = Array.from(fileList);
    if (!this.currentSupportConversation?.id) return;

    this._uploads.uploadChatFiles(Number(this.currentSupportConversation.id), files, true);
  }

  protected toggleAttachmentMenu = (e: Event) => {
    e.stopPropagation();
    this.showAttachmentMenu.update(v => !v);
  };

  private resetSupportInput(): void {
    this.message.set('');
    this.clearFiles();
    this._uploads.resetState();
  }

  protected clearFiles = () => {
    this.selectedSupportFiles.set([]);
    if (isPlatformBrowser(this._platformId)) {
      this.attachmentMenu?.clearFileInputs();
    }
  };

  /** ✅ Setup effect to send uploaded files */
  private setupUploadFilesEffect(): void {
    effect(() => {
      const uploadedFiles = this.uploadedFilesMetadata();
      Logger.debug('[SupportMessageInputComponent] Upload state', {
        loading: this.isUploading(),
        error: this.uploadError(),
        response: this.uploadResponse(),
        uploadedFiles,
      });

      if (!uploadedFiles?.length) return;

      uploadedFiles.forEach(file => this.handleUploadedFile(file));
    });
  }

  /** ✅ Handle a single uploaded file */
  private handleUploadedFile(file: IUploadedFileMetadata): void {
    if (!file) return;

    const messagePayload: Omit<ISupportMessageModel, 'id' | 'timestamp'> = {
      senderId: this.userInfo?.id?.toString() ?? '',
      senderName: this.currentSupportConversation?.user_id?.full_name ?? 'مستخدم',
      senderImage: this.currentSupportConversation?.user_id?.image ?? '',
      message: file.link ?? '',
      fileSize: file.size,
      fileName: file.name,
      msgType: file.type,
      is_read: '0',
      msgTime: Date.now(),
    };

    this.sendFileMessage(messagePayload);
  }

  /** ✅ Send file message */
  private sendFileMessage(message: Omit<ISupportMessageModel, 'id' | 'timestamp'>): void {
    this._firestoreService.sendSupportMessage(
      this.getConversationObject(),
      message,
      this.currentSupportConversation,
      this.isSupport
    );
  }

  /** ✅ Build SupportConversationModel */
  private getConversationObject(): SupportConversationModel {
    if (!this.currentSupportConversation) {
      return { sender_id: null, receiver_id: null, conversation_id: null };
    }

    return {
      sender_id: this.userInfo?.id ? Number(this.userInfo.id) : null,
      receiver_id: this.isSupport
        ? (this.currentSupportConversation.user_id?.id
          ? Number(this.currentSupportConversation.user_id.id)
          : null)
        : (this.currentSupportConversation.customer_support_user_id?.id
          ? Number(this.currentSupportConversation.customer_support_user_id.id)
          : null),
      conversation_id: this.currentSupportConversation.id
        ? Number(this.currentSupportConversation.id)
        : null,
    };
  }
}
