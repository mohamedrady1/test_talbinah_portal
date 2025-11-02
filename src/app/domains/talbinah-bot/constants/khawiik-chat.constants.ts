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
    TITLE: 'khawiik.textChat.title',
    SUBTITLE: 'khawiik.textChat.subtitle',
    PLACEHOLDER: 'khawiik.textChatPage.input.placeholder',
    SEND: 'khawiik.textChatPage.input.sendButton',
    VOICE_BUTTON: 'khawiik.textChatPage.input.voiceButton',
    NEW_CHAT: 'khawiik.textChatPage.header.actions.newChat',
    ZOOM_IN: 'khawiik.textChatPage.header.actions.zoomIn',
    ZOOM_OUT: 'khawiik.textChatPage.header.actions.zoomOut'
  },
  VOICE_CHAT: {
    TITLE: 'khawiik.voiceChat.title',
    SUBTITLE: 'khawiik.voiceChat.subtitle',
    PLACEHOLDER: 'khawiik.voiceChat.placeholder',
    SEND: 'khawiik.voiceChat.send',
    TEXT_BUTTON: 'khawiik.voiceChat.textButton',
    NEW_CHAT: 'khawiik.voiceChat.newChat',
    ZOOM_IN: 'khawiik.voiceChat.zoomIn',
    ZOOM_OUT: 'khawiik.voiceChat.zoomOut',
    WELCOME: {
      ICON: 'khawiik.voiceChat.welcome.icon',
      WELCOME: 'khawiik.voiceChat.welcome.welcome',
      SUBTITLE: 'khawiik.voiceChat.welcome.subtitle'
    }

  },
  COMMON: {
    WELCOME_ICON: 'khawiik.textChatPage.welcome.icon',
    WELCOME: 'khawiik.textChatPage.welcome.welcome',
    SUBTITLE: 'khawiik.textChatPage.welcome.subtitle',
    WHATS_ON_MIND: 'khawiik.textChat.whatsOnMind',
    WEEK_DAYS: {
      WEDNESDAY: 'khawiik.weekDays.wednesday',
      THURSDAY: 'khawiik.weekDays.thursday',
      FRIDAY: 'khawiik.weekDays.friday',
      SATURDAY: 'khawiik.weekDays.saturday',
      SUNDAY: 'khawiik.weekDays.sunday',
      MONDAY: 'khawiik.weekDays.monday',
      TUESDAY: 'khawiik.weekDays.tuesday'
    }
  }
} as const;
