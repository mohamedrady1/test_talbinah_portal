// =========================
// Voices
// =========================
export interface IKhawiikVoice {
  name: string;
  sample_url: string;
  cached: boolean;
}

export interface IKhawiikVoiceTypesDataDto {
  voices: IKhawiikVoice[];
}

// =========================
// Save Voice Preference
// =========================
export interface ISaveKhawiikVoiceTypeDataDto {
  message: string | null;
  voice: string;
}

// =========================
// Voice Activities
// =========================
export interface IKhawiikVoiceActivity {
  id: number;
  slug: string;
  title: string;
  opening: string;
  icon: string;
}

export interface IKhawiikVoiceActivitiesDataDto {
  items: IKhawiikVoiceActivity[];
}

// =========================
// Khawiik Books
// =========================
export interface IKhawiikBookConfig {
  days: number;
  min_voice_seconds_per_day?: number;
  min_text_msgs_per_day?: number;
  topic_slug?: string;
}

export interface IKhawiikBook {
  id: number;
  slug: string;
  title: string;
  description: string;
  config: IKhawiikBookConfig;
  mode: string;
  active: boolean;
  updated_at: string; // ISO string or backend format
  user_status: 'not_started' | 'in_progress' | 'completed' | string;
  type?: 'text' | 'voice' | string; // Optional type property for mode display
  progress: {
    days_total?: number;
    days_done?: number;
    completed?: boolean;
    voice_seconds?: number;
    required_seconds?: number;
  };
}

export interface IKhawiikBooksDataDto {
  items: IKhawiikBook[];
}

// =========================
// Voice Realtime Session
// =========================
export interface IKhawiikVoiceRealtimeSessionDataDto {
  session_id: string;
  ephemeral_key: string;
  expires_at: number;              // Unix timestamp
  seconds_until_expiry: number;    // Seconds until expiry
  webrtc_url: string;
  deployment: string;
  api_version: string;
  voice: string;
}

// Full response DTO (optional, if you want to type the entire API response)
export interface IKhawiikVoiceRealtimeSessionResponseDto {
  status: boolean;
  message: string | null;
  data: IKhawiikVoiceRealtimeSessionDataDto | null;
}

// =========================
// Mission Start
// =========================
export interface IStartMissionChat {
  id: number;
  name: string;
  created_at: string;
  chat_thread_id: string;
  updated_at: string;
  meta: {
    card_slug: string;
  };
}

export interface IStartMissionDataDto {
  message: string;
  replay: string;
  voice_replay: string | null;
  list: any[];
  chat: IStartMissionChat;
}

export interface IStartMissionResponseDto {
  status: boolean;
  message: string | null;
  data: IStartMissionDataDto;
}

// =========================
// Voice Track Response
// =========================
export interface IVoiceTrackDataDto {
  message: string;
  seconds_tracked: number;
  mission_slug: string;
}

export interface IVoiceTrackResponseDto {
  status: boolean;
  message: string | null;
  data: IVoiceTrackDataDto | null;
}
