import { Component, ChangeDetectionStrategy, Input, Output, inject, effect, EventEmitter } from "@angular/core";
import { CloseSupportConversationFacade } from "../../services";
import { ITechnicalSupportChatDto } from "../../dtos";
import { TranslationsFacade } from "../../../../common/core/translations/services";
import { Logger } from "../../../../common";

@Component({
  selector: 'app-close-support-conversation',
  standalone: true,
  imports: [
  ],
  templateUrl: './close-support-conversation.component.html',
  styleUrls: ['./close-support-conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseSupportConversationComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input({ required: true }) data: { chatItem: ITechnicalSupportChatDto | null, isSupport?: boolean } = { chatItem: null };
  @Output() closed = new EventEmitter<{ isRequestSuccessed?: boolean } | void>();

  public readonly _CloseSupportConversationFacade = inject(CloseSupportConversationFacade);

  constructor() {
    effect(() => {
      if (this._CloseSupportConversationFacade.closeSuccess() && !this._CloseSupportConversationFacade.isClosing()) {
        Logger.debug('CloseSupportConversationComponent => Cancellation Price successful, emitting closed event with form data.');
        setTimeout(() => {
          this.closed.emit({ isRequestSuccessed: true });
        }, 0);
      }
      else if (this._CloseSupportConversationFacade.closeError() && !this._CloseSupportConversationFacade.isClosing()) {
        Logger.error('CloseSupportConversationComponent => Cancellation Price failed, closing modal.');
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('TechnicalSupportConversationComponent | chatItem: ', this.data.chatItem);
    this._CloseSupportConversationFacade.resetState();
  }

  protected onConfirmCloseConversation(): void {
    this._CloseSupportConversationFacade.closeConversation(this.data.chatItem?.id ?? 0, this.data?.isSupport);
  }

  protected onCancel(): void {
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this._CloseSupportConversationFacade.resetState();
  }
}
