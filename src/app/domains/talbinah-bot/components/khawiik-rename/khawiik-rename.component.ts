import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { ChatHistoryFacade, ConversationFacade } from '../../services';
import { ChatEventsService } from '../../services/chat-events.service';
import { IChatHistoryItemDataDto } from '../../dtos';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';
@Component({
  selector: 'app-khawiik-rename',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    TranslateApiPipe
  ],
  templateUrl: './khawiik-rename.component.html',
  styleUrls: ['./khawiik-rename.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikRenameComponent {
  @Input() chatItem!: IChatHistoryItemDataDto;
  @Output() closed = new EventEmitter<void>();
  @Output() titleUpdated = new EventEmitter<IChatHistoryItemDataDto>();

  // ====== Dependencies ======
  private readonly chatHistoryFacade = inject(ChatHistoryFacade);
  private readonly conversationFacade = inject(ConversationFacade);
  private readonly chatEvents = inject(ChatEventsService);
  private readonly platformId = inject(PLATFORM_ID);

  // ====== SSR Check ======
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  // ====== State ======
  protected readonly editableTitle = signal<string>('');
  protected readonly lastSavedTitle = signal<string>('');
  protected readonly isSaving = signal<boolean>(false);
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly hasAutoSelectedOnEdit = signal<boolean>(false);

  ngOnInit(): void {
    if (this.chatItem) {
      this.editableTitle.set(this.chatItem.name || '');
      this.lastSavedTitle.set(this.chatItem.name || '');
    }
  }

  // ====== Template actions ======
  protected startEditing(): void {
    if (this.isEditMode()) return;
    this.isEditMode.set(true);
    this.hasAutoSelectedOnEdit.set(false);

    // Focus and select ONLY once when entering edit mode
    setTimeout(() => {
      if (this.hasAutoSelectedOnEdit()) return;
      const input = document.querySelector('.khawiik-rename__input') as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
        this.hasAutoSelectedOnEdit.set(true);
      }
    }, 0);
  }

  protected saveTitle(): void {
    if (!this.chatItem?.id || this.isSaving()) return;

    const trimmed = this.editableTitle().trim();
    const newTitle = trimmed || 'محادثة جديدة';

    if (newTitle === this.lastSavedTitle()) {
      this.closeModal();
      return;
    }

    this.isSaving.set(true);

    this.chatHistoryFacade.editChatName(this.chatItem.id, newTitle).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        if (response.status && response.data) {
          this.lastSavedTitle.set(response.data.name);
          this.editableTitle.set(response.data.name);

          // Update the chat item in the facade
          this.chatHistoryFacade.updateChatNameInHistory(this.chatItem.id, response.data.name);

          // Emit the updated chat data to parent components
          this.titleUpdated.emit(response.data);

          // Broadcast the rename to interested components
          this.chatEvents.emitTitleUpdated({ id: this.chatItem.id, name: response.data.name });

          // Refresh conversation only if this chat is the active one
          const activeId = this.chatEvents.getActiveChatId();
          if (activeId && this.chatItem?.id === activeId) {
            this.conversationFacade.fetchConversation(this.chatItem.id);
          }

          // Close the modal after successful save
          setTimeout(() => {
            this.closeModal();
          }, 500);
        }
      },
      error: (error) => {
        this.isSaving.set(false);
        Logger.error('Failed to save chat title:', error);
      }
    });
  }

  protected cancelEdit(): void {
    this.editableTitle.set(this.lastSavedTitle());
    this.isEditMode.set(false);
    this.closed.emit();
    this.hasAutoSelectedOnEdit.set(false);
  }

  protected closeModal(): void {
    this.closed.emit();
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!this.isSaving()) {
          this.saveTitle();
        }
        break;
      case 'Escape':
        this.cancelEdit();
        break;
    }
  }

  protected onTitleInputChange(): void {
    // Intentionally left blank to avoid re-selecting text on each keystroke
  }
}

