import { Language } from "../models";
import { AVAILABLE_LANGUAGES } from "./available-languages.data";

export const DEFAULT_LANGUAGE: Language = AVAILABLE_LANGUAGES.find(lang => lang.code === 'ar')!;
export const DEFAULT_LANGUAGE_CODE: string = DEFAULT_LANGUAGE.code;
