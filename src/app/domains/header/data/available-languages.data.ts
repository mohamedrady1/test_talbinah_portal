import { Language } from "../models";

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    iconPath: 'assets/flags/ar.svg',
    direction: 'rtl'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    iconPath: 'assets/flags/en.svg',
    direction: 'ltr'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    iconPath: 'assets/flags/ru.svg',
    direction: 'ltr'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    iconPath: 'assets/flags/zh.svg',
    direction: 'ltr'
  }
];
