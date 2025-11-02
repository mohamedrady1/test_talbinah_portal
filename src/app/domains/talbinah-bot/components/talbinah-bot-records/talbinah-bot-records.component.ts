import { Component, computed, signal, EventEmitter, Output, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { AccordionItem, DynamicAccordionItemComponent, EmptyStateComponent, EmptyStateConfig, ErrorStateComponent, ErrorStateConfig } from '../../../../shared'; // Adjust path as needed
import { TranslateModule } from '@ngx-translate/core';
import { RecordsHeader } from '../../constants'; // Adjust path as needed
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe for usage in TS if needed
import { FormsModule } from '@angular/forms'; // REQUIRED for [(ngModel)]

// Import the facade and DTOs
import { ChatHistoryFacade } from '../../services'; // Adjust path if needed
import { IChatHistoryItemDataDto } from '../../dtos'; // Adjust path if needed
import { AutoExactHeightDirective, LanguageService } from '../../../../common';
import { ChatMenuComponent } from '../chat-menu';

/**
 * Component-specific interface for chat records, extending the API DTO
 * to include UI-specific state properties like selection and highlighting.
 */

export interface ChatRecord extends IChatHistoryItemDataDto {
  selected?: boolean;
  highlightedTitle?: string; // For displaying search matched text with <mark> tags
}

export const ChatEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/bot/no-chats.svg',
  title: 'talbinahBot.EmptyChats',
  gap: '1rem'
};


export function getChatsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/bot/no-chats-error.svg',
    title: 'talbinahBot.ErrorChats',
    gap: '1rem',
    onRetry
  };
}


@Component({
  selector: 'app-talbinah-bot-records',
  standalone: true,
  imports: [
    DynamicAccordionItemComponent,
    TranslateModule,
    CommonModule,
    FormsModule // Necessary for ngModel two-way binding
    ,
    EmptyStateComponent,
    ErrorStateComponent,
    ChatMenuComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './talbinah-bot-records.component.html',
  styleUrls: ['./talbinah-bot-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize change detection for performance
})
export class TalbinahBotRecordsComponent implements OnInit {
  // Constant for the accordion header item
  readonly item: AccordionItem = RecordsHeader;

  // Dependencies injected using `inject`
  protected readonly languageService: LanguageService = inject(LanguageService);
  private readonly chatHistoryFacade: ChatHistoryFacade = inject(ChatHistoryFacade);

  // Expose current language for date pipe localization
  protected readonly currentLang = this.languageService.getCurrentLanguage();

  // Output event emitter: Notifies parent component when a chat is selected
  @Output() chatSelected: EventEmitter<ChatRecord> = new EventEmitter<ChatRecord>();

  // Facade selectors exposed as public readonly signals for template access
  readonly chatsListFromFacade = this.chatHistoryFacade.chatHistory;
  readonly isLoadingHistory = this.chatHistoryFacade.isLoading;
  readonly errorMessageHistory = this.chatHistoryFacade.errorMessage;
  readonly status = this.chatHistoryFacade.status;

  // Internal component state signals
  readonly searchQuery = signal<string>(''); // Manages the search input value
  private readonly currentlySelectedChatId = signal<number | null>(null); // Tracks the ID of the selected chat

  // Computed signal: Filters and transforms raw chat history DTOs into ChatRecord objects
  // suitable for UI display, applying selection status and search highlighting.
  readonly filteredChats = computed<ChatRecord[]>(() => {
    const query: string = (this.searchQuery() ?? '').trim().toLowerCase();
    const currentSelectedId: number | null = this.currentlySelectedChatId();

    return this.chatsListFromFacade() // Get the raw IChatHistoryItemDataDto[] from the facade
      .map((chatDto: IChatHistoryItemDataDto) => {
        // Create a ChatRecord object, extending with UI-specific properties
        const chatRecord: ChatRecord = {
          ...chatDto, // Inherit id, name, last_message_at
          selected: chatDto.id === currentSelectedId, // Determine selection status
          highlightedTitle: this.highlightMatch(chatDto.name ?? '', query) // Apply search highlighting
        };
        return chatRecord;
      })
      .filter((chatRecord: ChatRecord) => {
        // Filter the list based on the search query matching the chat's name
        const chatName: string = chatRecord.name ?? '';
        return chatName.toLowerCase().includes(query);
      });
  });

  chatEmptyState = ChatEmptyState;
  protected readonly chatsErrorState = getChatsError(() => this.chatHistoryFacade.fetchChatHistory());

  constructor() {
    effect(() => {
      const chats: IChatHistoryItemDataDto[] = this.chatsListFromFacade(); // Current chats from facade
      const selectedId: number | null = this.currentlySelectedChatId(); // Currently selected chat ID

      if (chats.length > 0) {
        const foundSelected = chats.find((chat: IChatHistoryItemDataDto) => chat.id === selectedId);

        if (selectedId === null || !foundSelected) {
          // Case 1: No chat is currently selected OR previously selected chat is not in the new list.
          // Attempt to select the first chat in the filtered list.
          const firstChatInFilteredList = this.filteredChats()[0];
          if (firstChatInFilteredList) {
            this.selectChat(firstChatInFilteredList);
          } else if (selectedId !== null) {
            // No filtered chats, but something was selected. Deselect it.
            this.currentlySelectedChatId.set(null);
            this.chatSelected.emit(null!); // Inform parent no chat is selected
          }
        }
        // Case 2: A chat is selected and still exists in the list. No action needed here.
      } else if (chats.length === 0 && selectedId !== null) {
        // Case 3: No chats are present (e.g., empty history, or filtered to empty),
        // ensure no chat is marked as selected.
        this.currentlySelectedChatId.set(null);
        this.chatSelected.emit(null!); // Inform parent no chat is selected
      }
    });
  }

  ngOnInit(): void {
    // Initiate fetching of chat history from the backend via the facade.
    this.chatHistoryFacade.fetchChatHistory();
  }

  protected selectChat(chat: ChatRecord | null | undefined): void {
    if (!chat || typeof chat.id !== 'number') {
      this.currentlySelectedChatId.set(null);
      this.chatSelected.emit(null!);
      return;
    }

    this.currentlySelectedChatId.set(chat.id);
    this.chatSelected.emit({ ...chat, selected: true });
  }

  public onChatTitleUpdated(updatedChat: IChatHistoryItemDataDto): void {
    this.chatHistoryFacade.updateChatNameInHistory(Number(updatedChat.id), updatedChat.name!);
  }
  private highlightMatch(text: string, query: string): string {
    if (!query?.trim()) {
      return text; // Return original text if query is empty or just whitespace
    }
    // Escape special regex characters in the query to prevent errors
    const escapedQuery: string = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create a global, case-insensitive regex to find all matches
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    // Replace matches with <mark> tags
    return (text ?? '').replace(regex, '<mark>$1</mark>');
  }
}
