import { IChatType, IChatTypeConfig } from "../interfaces";

// Translation keys for chat types
export const KHAWIIK_CHAT_TYPES_KEYS = {
  TITLE: 'khawiik.chatTypes.title',
  SUBTITLE: 'khawiik.chatTypes.subtitle',
  VOICE: 'khawiik.chatTypes.voice',
  TEXT: 'khawiik.chatTypes.text',
  CONTINUE: 'khawiik.chatTypes.continue'
} as const;

// Image paths
export const KHAWIIK_CHAT_TYPES_IMAGES = {
  MAIN_ICON: 'images/khawiik/khawiik-welcome-mian-icon.png'
} as const;

// Chat type enum
export enum ChatTypeEnumKeys {
  VOICE = 'voice',
  TEXT = 'text'
}

// Chat type options configuration
export const CHAT_TYPE_OPTIONS: readonly IChatType[] = [
  {
    id: ChatTypeEnumKeys.VOICE,
    label: 'khawiik.chatTypes.voice',
    icon: ChatTypeEnumKeys.VOICE,
    isActive: true
  },
  {
    id: ChatTypeEnumKeys.TEXT,
    label: 'khawiik.chatTypes.text',
    icon: ChatTypeEnumKeys.TEXT,
    isActive: false
  }
] as const;

// Default chat type configuration
export const DEFAULT_CHAT_TYPE_CONFIG: IChatTypeConfig = {
  defaultType: ChatTypeEnumKeys.VOICE,
  options: CHAT_TYPE_OPTIONS
} as const;
