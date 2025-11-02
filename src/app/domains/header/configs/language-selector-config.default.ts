import { LanguageSelectorType } from '../../../shared';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../data';
import { LanguageSelectorConfig } from './language-selector-config';

export const DEFAULT_LANGUAGE_SELECTOR_CONFIG: LanguageSelectorConfig = {
  availableLanguages: AVAILABLE_LANGUAGES,
  selectedLanguage: DEFAULT_LANGUAGE_CODE, // Default to Arabic
  type: LanguageSelectorType?.Inline // or .Inline, .Flags, etc. based on your enum
};
