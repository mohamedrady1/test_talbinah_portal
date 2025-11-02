// --- Request DTOs (these are sent TO the API, so they don't need the IApiResponse wrapper) ---

export interface IEditChatNameRequestDto {
  name: string;
}

export interface ISendMessageRequestDto {
  message: string;
  conversation_id?: number; // Optional, for continuing a conversation
  // ... any other parameters like message_type, attachments etc.
}

// For a new chat, you might just send an initial message string, or a structured object
// Depending on your API, 'initialMessage' param in startNewChat might be sufficient
// or you might need a DTO like this:
export interface IStartNewChatRequestDto {
  initial_message?: string;
  start: number;
  card_slug?: string;
  doctor_id?: number;
  // ... other start chat parameters
}

// =========================
// Mission Start Request
// =========================
export interface IStartMissionRequestDto {
  start: number;
}

// =========================
// Voice Track Request
// =========================
export interface IVoiceTrackRequestDto {
  seconds: number;
  mission_slug: string;
}