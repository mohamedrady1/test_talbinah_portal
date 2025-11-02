import { WeekDay } from "../models";

function getNow(): Date {
  try {
    return new Date();
  } catch {
    return new Date(Date.UTC(2025, 0, 1));
  }
}

const BASE_WEEK = [
  { id: 'saturday', dayNumber: 1, dayName: 'saturday' },
  { id: 'sunday', dayNumber: 2, dayName: 'sunday' },
  { id: 'monday', dayNumber: 3, dayName: 'monday' },
  { id: 'tuesday', dayNumber: 4, dayName: 'tuesday' },
  { id: 'wednesday', dayNumber: 5, dayName: 'wednesday' },
  { id: 'thursday', dayNumber: 6, dayName: 'thursday' },
  { id: 'friday', dayNumber: 7, dayName: 'friday' },
] as const;

export const WEEK_DAYS: readonly WeekDay[] = (() => {
  const now = getNow();
  const jsDayIndex = now.getDay();
  const jsToCustomDayNumber = [2, 3, 4, 5, 6, 7, 1] as const;
  const todayDayNumber = jsToCustomDayNumber[jsDayIndex];

  return BASE_WEEK.map(d => {
    const date = new Date(now);
    const offset = d.dayNumber - todayDayNumber;
    date.setDate(now.getDate() + offset);

    return {
      id: d.id,
      dayNumber: d.dayNumber,
      dayName: d.dayName,
      dayDate: date.toISOString(),
      isToday: d.dayNumber === todayDayNumber
    } as WeekDay;
  });
})();

export const CHAT_KEYS = {
  TEXT_CHAT: {
    TITLE: 'text_conversation',
    SUBTITLE: 'chat_with_talbinah_bot_via_text',
    PLACEHOLDER: 'write_your_message',
    SEND: 'send',
    VOICE_BUTTON: 'switch_to_voice',
    NEW_CHAT: 'new_conversation',
    ZOOM_IN: 'khawiik.textChatPage.header.actions.zoomIn',
    ZOOM_OUT: 'khawiik.textChatPage.header.actions.zoomOut'
  },
  VOICE_CHAT: {
    TITLE: 'voice_conversation',
    SUBTITLE: 'chat_with_talbinah_bot_via_voice',
    PLACEHOLDER: 'press_to_talk',
    SEND: 'send',
    TEXT_BUTTON: 'convert_to_text',
    NEW_CHAT: 'new_conversation',
    ZOOM_IN: 'khawiik.voiceChat.zoomIn',
    ZOOM_OUT: 'khawiik.voiceChat.zoomOut',
    WELCOME: {
      ICON: 'talbinah_welcome_icon',
      WELCOME: 'talbinah_greeting_1',
      SUBTITLE: 'talbinah_greeting_2'
    }

  },
  COMMON: {
    WELCOME_ICON: 'talbinah_welcome_icon',
    WELCOME: 'khawiik.textChatPage.welcome.welcome',
    SUBTITLE: 'khawiik.textChatPage.welcome.subtitle',
    WHATS_ON_MIND: 'whats_on_your_mind_today',
    WEEK_DAYS: {
      WEDNESDAY: 'wednesday',
      THURSDAY: 'thursday',
      FRIDAY: 'friday',
      SATURDAY: 'saturday',
      SUNDAY: 'sunday',
      MONDAY: 'monday',
      TUESDAY: 'tuesday'
    }
  }
} as const;
