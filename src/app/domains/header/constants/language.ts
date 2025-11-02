import { AVAILABLE_LANGUAGES } from "../data";

export const SUPPORTED_LANGUAGE_CODES = AVAILABLE_LANGUAGES.map(l => l.code); // ['en', 'ar', 'ru', 'zh']
export const LANGUAGE_PREFIX_PATTERN = SUPPORTED_LANGUAGE_CODES.join('|'); // 'en|ar|ru|zh'
