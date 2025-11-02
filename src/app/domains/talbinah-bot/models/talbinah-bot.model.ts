import { IPaginationData } from "../../../common";
import { IChatConversationDataDto, IChatHistoryItemDataDto, IChatMessageDataDto } from "../dtos";

export interface ChatHistoryListState extends IPaginationData {
  response: IChatHistoryItemDataDto[];
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  status: boolean;
}

export interface ConversationDetailState {
  response: IChatConversationDataDto[] | null; // Full conversation details
  isLoading: boolean;
  errorMessage: string | null;
  status?: boolean;
}

export interface startNewChatState {
  response: IChatConversationDataDto | null; // Full conversation details
  isLoading: boolean;
  errorMessage: string | null;
  status?: boolean;
}

export interface MessageSendingState {
  isSending: boolean;
  lastBotResponse: IChatMessageDataDto | null;
  status: boolean;
  errorMessage: string | null;
}

export interface TalbinahBotFeatureState {
  chatHistory: ChatHistoryListState;
  currentConversation: ConversationDetailState;
  messageStatus: MessageSendingState;
  // Add other states as needed, e.g., for chat deletion, editing, etc.
}

export const initialChatHistoryListState: ChatHistoryListState = {
  response: [],
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 0,
  totalPages: 0,
  pageSize: 10, // Assuming a default page size
  itemsOnPage: 0,// <-- FIX: Added this missing property with an initial value
  status: false
};

export const initialConversationDetailState: ConversationDetailState = {
  response: null,
  isLoading: false,
  status: false,
  errorMessage: null
};


export const initialNewChatState: startNewChatState = {
  response: null,
  isLoading: false,
  status: false,
  errorMessage: null
};

export const initialMessageSendingState: MessageSendingState = {
  isSending: false,
  status: false,
  lastBotResponse: null,
  errorMessage: null
};

export const initialTalbinahBotFeatureState: TalbinahBotFeatureState = {
  chatHistory: initialChatHistoryListState,
  currentConversation: initialConversationDetailState,
  messageStatus: initialMessageSendingState
};
