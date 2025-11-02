import { TechnicalSupportConversationComponent } from "../technical-support-conversation";
import { ModalService, SvgIconComponent, useTimeAgoRealtime } from "../../../../shared";
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ITechnicalSupportChatDto } from '../../dtos';
import { LanguageService } from '../../../../common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-support-chat-card',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './technical-support-chat-card.component.html',
  styleUrls: ['./technical-support-chat-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalSupportChatCardComponent {
  @Input({ required: true }) chat!: ITechnicalSupportChatDto;

  private readonly _modalService = inject(ModalService);

  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.getCurrentLanguage();

  ngOnInit(): void {
    // this.chat?.id == 20 ? this.openSupportConversationModal() : '';
  }

  get statusLabel(): string {
    return this.chat.is_closed ? 'منتهية' : 'نشطة';
  }

  get statusClass(): string {
    return this.chat.is_closed ? 'ended' : 'active';
  }

  protected returnItemTimeAgo(id: number | string | undefined, createdAt?: string): string {
    if (!id || !createdAt) {
      return '--';
    }

    const diffSig = useTimeAgoRealtime(id, createdAt);
    const { value, unit } = diffSig();
    const rtf = new Intl.RelativeTimeFormat(this.currentLang || undefined, { numeric: 'auto' });
    return rtf.format(-value, unit as Intl.RelativeTimeFormatUnit);
  }

  protected openSupportConversationModal(): void {
    this._modalService.open(TechnicalSupportConversationComponent, {

      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'Technical_Support.title',
        subtitle: 'Technical_Support.subtitle',
        data: {
          chatItem: this.chat
        }
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: "60%"
    });
  }
}
