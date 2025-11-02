import { Component, computed, inject, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { LanguageSelectorType, LocalizationService, PublicService, StorageKeys } from '../../../../shared';
import { AppLanguageService, Logger, StorageService } from '../../../../common';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../../data';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageSelectorConfig } from '../../configs';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent {
  @Input() set config(value: LanguageSelectorConfig) {
    this._config.set(value);
  }
  @Output() languageChange = new EventEmitter<string>();

  private readonly _PublicService = inject(PublicService);
  private readonly _Translate = inject(TranslateService);
  private readonly _LocalizationService = inject(LocalizationService);
  private readonly _StorageService = inject(StorageService);
  private readonly _AppLanguageService = inject(AppLanguageService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _isBrowser = isPlatformBrowser(this._platformId);

  private _config = signal<LanguageSelectorConfig>({
    availableLanguages: AVAILABLE_LANGUAGES,
    selectedLanguage: DEFAULT_LANGUAGE_CODE,
    type: LanguageSelectorType?.Inline,
  });

  readonly selectedLanguage = computed(() => this._config().selectedLanguage ?? this._LocalizationService.getCurrentLanguage());
  readonly availableLanguages = computed(() => this._config().availableLanguages);
  readonly type = computed(() => {
    return this._config().type ?? LanguageSelectorType?.Inline;
  });

  readonly toggleLanguage = computed(() =>
    this._PublicService.getCurrentLanguage() === 'ar' ? 'en' : 'ar'
  );

  protected isDropdown(): boolean {
    return this.type() === LanguageSelectorType.Dropdown;
  }

  protected onSelectLanguage(event: Event | string): void {
    Logger.debug('LanguageSelectorComponent', 'onSelectLanguage', event);
    let selectedLang: string;

    if (typeof event === 'string') {
      selectedLang = event;
    } else {
      const selectElement = event.target as HTMLSelectElement;
      selectedLang = (selectElement.value || '').trim();
    }
    Logger.debug('LanguageSelectorComponent', 'onSelectLanguage', selectedLang);

    this._config.update(cfg => ({ ...cfg, selectedLanguage: selectedLang }));
    this.languageChange.emit(selectedLang);

    if (this._isBrowser) {
      this._StorageService.setItem<string>(StorageKeys.LANGUAGE, selectedLang, true);
      Logger.debug('LanguageSelectorComponent', 'StorageKeys.LANGUAGE', selectedLang);
      this._Translate.use(selectedLang);
      window.location.reload();
    }
  }

}
