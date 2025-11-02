import { ChangeDetectionStrategy, Component, Input, PLATFORM_ID, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingChatItemTypes } from '../../enums';
import { FileViewerComponent } from '../../../talbinah-bot/components/file-viewer/file-viewer.component';
import { ChatMessageVideoComponent } from '../../../talbinah-bot/components/chat-message-video/chat-message-video.component';
import { ChatMessageImageComponent } from '../../../talbinah-bot/components/chat-message-image/chat-message-image.component';
import { ChatDoctorCardComponent } from "../../../talbinah-bot/components/chat-doctor-card/chat-doctor-card.component";
import { PodcastBotComponent } from '../../../talbinah-bot/components/podcast-bot/podcast-bot.component';
import { ArticleCardComponent } from "../../../articles/components/article-card/article-card.component";
import { ChatMessageVoiceComponent } from '../../../talbinah-bot/components/chat-message-voice/chat-message-voice.component';
import { IMeetingChatItem } from '../../dtos';
import { IGlobalReservationModel, IUser } from '../../models';
import { DownloadableFile } from '../../../talbinah-bot/models';
import { FileType } from '../../../talbinah-bot';
import { CardType, IGlobalDoctorCopounModel, IGlobalMentalHealthScaleModel, Logger, StorageService } from '../../../../common';
import { StorageKeys } from '../../../../shared';
import { CardComponent, MentalHealthScaleCardComponent } from "../../../mental-health-scales";
import { DiscountCardForMeetingChatComponent } from "../discount-card-for-meeting-chat";
import { ChatMessageTextComponent } from '../chat-message-text';
@Component({
  selector: 'app-referenced-message',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FileViewerComponent,
    ChatMessageVideoComponent,
    ChatMessageImageComponent,
    ChatDoctorCardComponent,
    PodcastBotComponent,
    ArticleCardComponent,
    CardComponent,
    ChatMessageVoiceComponent,
    MentalHealthScaleCardComponent,
    DiscountCardForMeetingChatComponent,
    ChatMessageTextComponent
  ],
  templateUrl: './referenced-message.component.html',
  styleUrls: ['./referenced-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencedMessageComponent {
  @Input({ required: true }) item!: IMeetingChatItem | any | null;
  @Input({ required: true }) currentReservationData!: IGlobalReservationModel | null;

  @Input({ required: false }) userInfo!: IUser;
  private _StorageService = inject(StorageService);

  @Output() referencedMessageClicked = new EventEmitter<number>();

  readonly MeetingChatItemsTypes = MeetingChatItemTypes;
  private readonly platformId = inject(PLATFORM_ID);
  readonly cardTypes = CardType;

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
  }

  protected getDownloadableFile(item: IMeetingChatItem): DownloadableFile | null {
    if (!item || !item.message) {
      return null;
    }
    let fileTypeValue: FileType = FileType.PDF;
    if (item.msgType === this.MeetingChatItemsTypes.VIEW_PDF || item.msgType === this.MeetingChatItemsTypes.VIEW_PDF_ALT || item.msgType === this.MeetingChatItemsTypes.DOCUMENT || item.msgType === this.MeetingChatItemsTypes.FILE) {
      fileTypeValue = FileType.PDF;
    } else {
      return null;
    }
    return {
      name: item.fileName || this.extractFileNameFromUrl(item?.message) || 'document',
      url: item.message,
      type: fileTypeValue,
      size: item.fileSize ?? 0,
      date: item.msgTime ? new Date(item.msgTime) : undefined
    };
  }

  private extractFileNameFromUrl(url: string | any): string | null {
    if (!url || !isPlatformBrowser(this.platformId)) {
      return null;
    }
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

  protected onReferenceClick(messageId: number): void {
    this.referencedMessageClicked.emit(messageId);
  }

  protected parseJson<T = any>(msg: unknown): T | null {
    if (typeof msg === 'object' && msg !== null) {
      return msg as T;
    }

    if (typeof msg === 'string') {
      try {
        const safe = msg
          .trim()
          // quote keys: {foo: bar} -> {"foo": bar}
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
          // normalize single quotes to double
          .replace(/'/g, '"')
          // remove trailing commas
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');

        return JSON.parse(safe) as T;
      } catch (error) {
        Logger.error('❌ Failed to parse JSON:', error, msg);
        return null;
      }
    }

    Logger.warn('⚠️ Unsupported input to parseJson:', msg);
    return null;
  }

  protected isMentalHealthScaleMessage(msg: any): msg is IGlobalMentalHealthScaleModel {
    return msg && typeof msg === 'object' && 'mental_category_name' in msg && 'title' in msg;
  }
  protected isDoctorCopounMessage(msg: any): msg is IGlobalDoctorCopounModel {
    return msg && typeof msg === 'object' && 'discount' in msg && 'type' in msg;
  }
}
