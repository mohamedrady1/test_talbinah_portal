import { Component, ChangeDetectionStrategy, signal, computed, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DEFAULT_CHAT_TYPE_CONFIG, KHAWIIK_CHAT_TYPES_IMAGES } from '../../constants';
import { KhawiikInstructionsComponent } from '../khawiik-instructions';
import { ModalService, SvgIconComponent } from '../../../../shared';
import { Logger } from '../../../../common';
import { ChatTypeEnum } from '../../enums';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-khawiik-chat-types',
  standalone: true,
  imports: [CommonModule, TranslateModule, SvgIconComponent, TranslateApiPipe],
  templateUrl: './khawiik-chat-types.component.html',
  styleUrls: ['./khawiik-chat-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikChatTypesComponent implements OnInit {
  // ====== Dependencies ======
  private readonly _ModalService = inject(ModalService);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Configuration ======
  readonly config = DEFAULT_CHAT_TYPE_CONFIG;
  readonly mainIcon = KHAWIIK_CHAT_TYPES_IMAGES.MAIN_ICON;

  // ====== State (signals) ======
  private readonly _selectedType = signal<ChatTypeEnum>(this.config.defaultType);
  readonly selectedType = this._selectedType.asReadonly();

  // derived lists / computed
  readonly chatTypeOptions = computed(() =>
    this.config.options.map(option => ({
      ...option,
      isActive: option.id === this.selectedType(),
    })),
  );

  readonly isVoiceSelected = computed(() => this.selectedType() === 'voice');
  readonly isTextSelected = computed(() => this.selectedType() === 'text');

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    // no-op for SSR; kept for parity with other components and future hooks
  }

  // ====== Public / template actions ======
  protected selectChatType(type: ChatTypeEnum): void {
    if (!this.isBrowser) return;
    this._selectedType.set(type);
  }

  protected onContinue(): void {
    if (!this.isBrowser) return;
    this._ModalService.closeAll();
    this._openInstructionsModal();
  }

  protected isChatTypeActive(type: ChatTypeEnum): boolean {
    return this.selectedType() === type;
  }

  protected getButtonClasses(type: ChatTypeEnum): string {
    const baseClasses = 'khawiik-chat-types__button';
    const activeClasses = this.isChatTypeActive(type)
      ? 'khawiik-chat-types__button--active'
      : '';
    return `${baseClasses} ${activeClasses}`.trim();
  }

  protected getTitleClasses(type: ChatTypeEnum): string {
    const baseClasses = 'khawiik-chat-types__button-title';
    const activeClasses = this.isChatTypeActive(type)
      ? 'khawiik-chat-types__button-title--active'
      : '';
    return `${baseClasses} ${activeClasses}`.trim();
  }

  // ====== Private helpers ======
  private _openInstructionsModal(): void {
    if (!this.isBrowser) return;
    this._ModalService.open(KhawiikInstructionsComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
        selectedChatType: this.selectedType(),
      },
      outputs: {
        closed: () => Logger.debug('KhawiikChatTypesComponent | The modal is closed')
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikChatTypesComponent | onCloseClick | The modal is closed')
    });
  }
}
