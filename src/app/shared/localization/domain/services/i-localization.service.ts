export abstract class ILocalizationService {
  abstract translateTextFromJson(key: string): string;
  abstract getCurrentLanguage(): string;
}
