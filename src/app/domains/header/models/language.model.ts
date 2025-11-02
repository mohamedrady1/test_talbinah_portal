export interface Language {
  code: string;            // e.g. "en"
  name: string;            // e.g. "English"
  nativeName: string;      // e.g. "English", "العربية", "中文"
  iconPath: string;        // Path to language icon asset (e.g. flag)
  direction: 'ltr' | 'rtl' // For layout directionality
}
