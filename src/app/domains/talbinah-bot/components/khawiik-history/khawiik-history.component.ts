import {
  Component, ChangeDetectionStrategy, PLATFORM_ID, inject, computed, signal, EventEmitter, Output, OnInit,
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { EmptyStateComponent } from './../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from './../../../../shared/components/error-state/error-state.component';
import { SvgIconComponent } from './../../../../shared/components/svg-icon/svg-icon.component';
import { AutoExactHeightDirective } from './../../../../common/core/directives/clickOutside/auto-exact-height.directive';
import { LanguageService } from './../../../../common/core/app-language/language.service';
import { Logger } from './../../../../common/core/utilities/logging/logger';
import { ChatRecord } from './../talbinah-bot-records/talbinah-bot-records.component';
import { IChatHistoryItemDataDto } from '../../dtos/responses/chat-responses.dto';
import { ChatHistoryFacade } from './../../services/chat-history.facade';
import { ChatMenuComponent } from './../chat-menu/chat-menu.component';
import { KhawiikHistorySkeletonComponent } from './../../skeletons/khawiik-history-skeleton/khawiik-history-skeleton.component';
import { KhawiikRenameComponent } from '../khawiik-rename';
import { EmptyStateConfig } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { ModalService } from '../../../../shared';
import { ErrorStateConfig } from '../../../../shared/components/error-state-card/error-state-card.component';
import { TranslationsFacade } from '../../../../common/core/translations/services';

// ====== UI Configs ======
export const KhawiikHistoryChatEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/bot/no-chats.svg',
  title: 'no_conversations_available',
  gap: '1rem',
};

export function getKhawiikHistoryChatsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/bot/no-chats-error.svg',
    title: 'khawiik.history.error',
    gap: '1rem',
    onRetry,
  };
}

@Component({
  selector: 'app-khawiik-history',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    DatePipe,
    AutoExactHeightDirective,
    EmptyStateComponent,
    ErrorStateComponent,
    ChatMenuComponent,
    SvgIconComponent,
    KhawiikHistorySkeletonComponent
  ],
  templateUrl: './khawiik-history.component.html',
  styleUrls: ['./khawiik-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikHistoryComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Output() protected closed = new EventEmitter<ChatRecord | null>();
  @Output() protected chatSelected = new EventEmitter<ChatRecord | null>();
  @Output() protected titleUpdated = new EventEmitter<IChatHistoryItemDataDto>();

  // ====== Dependencies ======
  private readonly chatHistoryFacade = inject(ChatHistoryFacade);
  private readonly languageService = inject(LanguageService);
  private readonly modalService = inject(ModalService);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Static UI Configs ======
  protected readonly emptyState = KhawiikHistoryChatEmptyState;
  protected readonly errorState: ErrorStateConfig = getKhawiikHistoryChatsError(() =>
    this.chatHistoryFacade.fetchChatHistory(),
  );

  // ====== Facade state ======
  readonly chatsListFromFacade = this.chatHistoryFacade.chatHistory;
  readonly isLoadingHistory = this.chatHistoryFacade.isLoading;
  readonly errorMessageHistory = this.chatHistoryFacade.errorMessage;
  readonly status = this.chatHistoryFacade.status;

  // ====== Local state ======
  readonly searchQuery = signal<string>('');
  private readonly currentlySelectedChatId = signal<number | null>(null);



  // ====== Derived state ======
  readonly filteredChats = computed<ChatRecord[]>(() => {
    const query = (this.searchQuery() ?? '').trim().toLowerCase();
    const selectedId = this.currentlySelectedChatId();

    return this.chatsListFromFacade()
      .map((chat) => ({
        ...chat,
        selected: chat.id === selectedId,
        highlightedTitle: this.highlightMatch(chat.name ?? '', query),
      }))
      .filter((chat) => (chat.name ?? '').toLowerCase().includes(query));
  });

  readonly currentLang = this.languageService.getCurrentLanguage();

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.chatHistoryFacade.fetchChatHistory();
  }

  // ====== Public / template actions ======
  protected selectChat(chat: ChatRecord | null): void {
    Logger.debug('[KhawiikHistory] selectChat called with:', chat);

    if (!chat || typeof chat.id !== 'number') {
      Logger.debug('[KhawiikHistory] Invalid chat, emitting null');
      this.currentlySelectedChatId.set(null);
      this.closed.emit(null);
      this.chatSelected.emit(null);
      return;
    }

    Logger.debug('[KhawiikHistory] Valid chat selected, emitting:', { ...chat, selected: true });
    this.currentlySelectedChatId.set(chat.id);

    // Emit chatSelected first, then closed
    this.chatSelected.emit({ ...chat, selected: true });

    // Close modal after a small delay to ensure chatSelected is processed
    setTimeout(() => {
      this.closed.emit(null);
    }, 0);

    Logger.info('[KhawiikHistory] Chat selected', {
      chatId: chat.id,
      chatName: chat.name,
    });
  }

  public onChatTitleUpdated(updated: IChatHistoryItemDataDto): void {
    if (!updated?.id || !updated?.name) return;
    this.chatHistoryFacade.updateChatNameInHistory(Number(updated.id), updated.name);
  }

  // Title editing methods
  protected startEditingTitle(chat: ChatRecord): void {
    // Convert ChatRecord to IChatHistoryItemDataDto format
    const chatData: IChatHistoryItemDataDto = {
      id: chat.id,
      name: chat.name || `محادثة رقم ${chat.id}`,
      created_at: chat.created_at || new Date().toISOString()
    };

    this.modalService.open(KhawiikRenameComponent, {
      inputs: {
        image: 'images/icons/logo-2.png',
        title: 'conversation_name',
        chatItem: chatData
      },
      outputs: {
        closed: () => {
          Logger.debug('KhawiikHistoryComponent | Rename modal closed');
        },
        titleUpdated: (updated: IChatHistoryItemDataDto) => {
          Logger.debug('KhawiikHistoryComponent | Title updated from rename modal:', updated);
          this.onChatTitleUpdated(updated);
          this.titleUpdated.emit(updated);
        }
      },
      width: '60vw',
      minHeight: 'auto',
      maxHeight: '80vh',
      onCloseClick: () => Logger.debug('KhawiikHistoryComponent | Rename modal closed via close button')
    });
  }
  // ====== Helpers ======
  private highlightMatch(text: string, query: string): string {
    if (!query?.trim()) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    );
    return (text ?? '').replace(regex, '<mark>$1</mark>');
  }
}
