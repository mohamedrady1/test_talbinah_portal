import { IPaginationData } from "../../../common"; // Adjust path if necessary
import { IMeetingChatItem } from "../dtos"; // Adjust paths

// Optional: If you have a list of chats (e.g., chat history)
export interface MeetingReservationChatListState extends IPaginationData {
  chatHistory: IMeetingChatItem[]; // Renamed from 'response' to be more specific
  isLoading: boolean;
  isFiltering: boolean;
  errorMessage: string | null;
  status: boolean;
}

// Holds the details (messages) of a specific meeting reservation chat
export interface MeetingReservationChatDetailState {
  chatMessages: IMeetingChatItem[] | null; // Renamed from 'response' to be more specific
  isLoading: boolean;
  errorMessage: string | null;
  status?: boolean; // Indicates success/failure of fetching chat messages
}

// State for sending individual messages within the meeting reservation chat
export interface MeetingReservationChatMessageSendingState {
  isSending: boolean;
  lastBotResponse: IMeetingChatItem | null; // Last message sent or received (e.g., bot's reply)
  status: boolean; // Status of the last message sending operation
  errorMessage: string | null;
}

// --- Initial States ---

export const initialMeetingReservationChatListState: MeetingReservationChatListState = {
  chatHistory: [],
  isLoading: false,
  isFiltering: false,
  errorMessage: null,
  totalItems: 0,
  currentPage: 0,
  totalPages: 0,
  pageSize: 10,
  itemsOnPage: 0,
  status: false
};

export const initialMeetingReservationChatDetailState: MeetingReservationChatDetailState = {
  chatMessages: null,
  isLoading: false,
  status: false,
  errorMessage: null
};

export const initialMeetingReservationChatMessageSendingState: MeetingReservationChatMessageSendingState = {
  isSending: false,
  status: false,
  lastBotResponse: null,
  errorMessage: null
};

// Optional: Feature-level state if you combine multiple sub-states
export interface MeetingReservationChatFeatureState {
  chatList: MeetingReservationChatListState;
  currentChat: MeetingReservationChatDetailState;
  messageSending: MeetingReservationChatMessageSendingState;
}

export const initialMeetingReservationChatFeatureState: MeetingReservationChatFeatureState = {
  chatList: initialMeetingReservationChatListState,
  currentChat: initialMeetingReservationChatDetailState,
  messageSending: initialMeetingReservationChatMessageSendingState
};
