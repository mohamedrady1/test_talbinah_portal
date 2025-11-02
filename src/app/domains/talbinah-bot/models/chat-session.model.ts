/**
 * Model for chat session data
 */
export interface ChatSessionPayload {
  readonly text: string;
  readonly timestamp?: string;
  readonly chatType: 'text' | 'voice';
}

/**
 * Model for week day data
 */
export interface WeekDay {
  readonly id: string;
  readonly dayNumber: number;
  readonly dayName: string;
  readonly isToday: boolean;
  dayDate?: string | Date;
}

/**
 * Model for chat message
 */
export interface ChatMessage {
  readonly id: string;
  readonly content: string;
  readonly timestamp: string;
  readonly sender: 'user' | 'bot';
  readonly type: 'text' | 'voice';
}

/**
 * Model for chat state
 */
export interface ChatState {
  readonly messages: readonly ChatMessage[];
  readonly isLoading: boolean;
  readonly isSending: boolean;
  readonly error: string | null;
  readonly hasMessages: boolean;
}


