import { Component, ChangeDetectionStrategy, Output, EventEmitter, signal, PLATFORM_ID, inject, Input, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { INSTRUCTION_CARDS, KHAWIIK_KEYS, KhawiikBotRoutesEnum } from '../../constants';
import { KhawiikInstructionsNextComponent } from '../khawiik-instructions-next';
import { ModalService } from '../../../../shared';

import { AutoExactHeightDirective, Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'khawiik-instructions',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,

    AutoExactHeightDirective
  ],
  templateUrl: './khawiik-instructions.component.html',
  styleUrls: ['./khawiik-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikInstructionsComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  // ====== Dependencies ======
  private readonly _ModalService = inject(ModalService);
  private readonly _router = inject(Router);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Inputs / Outputs ======
  @Input() selectedChatType: 'text' | 'voice' = 'text';
  @Output() openNext = new EventEmitter<void>();

  // ====== Configuration ======
  readonly instructionCards = INSTRUCTION_CARDS;
  readonly keys = KHAWIIK_KEYS;

  // ====== State (signals) ======
  private readonly _isSticky = signal(false);
  readonly isSticky = this._isSticky.asReadonly();

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    // No-op for now; reserved for future hooks
  }

  // ====== Public / template actions ======
  protected onContinue(): void {
    if (!this.isBrowser) return;
    this._openInstructionsNextModal();
  }

  protected onScroll(event: Event): void {
    if (!this.isBrowser) return;

    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const threshold = 100; // adjust as needed

    this._isSticky.set(scrollTop > threshold);
  }

  // ====== Private helpers ======
  private _openInstructionsNextModal(): void {
    if (!this.isBrowser) return;
    this._ModalService.closeAll();

    this._ModalService.open(KhawiikInstructionsNextComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'home_card_khawiik_title',
        subtitle: 'home_card_khawiik_description',
        chatType: this.selectedChatType,
      },
      outputs: {
        submit: (payload) => this._onInstructionsSubmit(payload),
        closed: () => Logger.debug('KhawiikInstructionsComponent | The modal is closed')
      },
      width: '60%',
      minHeight: '60%',
      maxHeight: '70%',
      backgroundColor: 'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => Logger.debug('KhawiikInstructionsComponent | onCloseClick | The modal is closed')
    });
  }

  private _onInstructionsSubmit(payload: {
    text: string;
    timestamp: string;
    chatType: 'text' | 'voice';
  }): void {
    if (!this.isBrowser) return;

    Logger.debug('KhawiikInstructionsComponent | Instructions submitted:', payload);

    // Close modal before navigation
    this._ModalService.closeAll();

    // Navigate based on chat type
    if (payload.chatType === 'text') {
      this._router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);
    } else if (payload.chatType === 'voice') {
      this._router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.VOICE_CHAT]);
    }
  }
}
