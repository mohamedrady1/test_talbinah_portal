import { LanguageSelectorType } from "../../../shared";
import { Language } from "../models";

export interface LanguageSelectorConfig {
  availableLanguages: Language[];
  selectedLanguage?: string;
  type?: LanguageSelectorType;
}
