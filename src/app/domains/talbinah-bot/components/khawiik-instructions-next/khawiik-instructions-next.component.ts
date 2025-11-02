import { Component, ChangeDetectionStrategy, Output, EventEmitter, signal, PLATFORM_ID, inject, Input, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { KHAWIIK_KEYS, KhawiikBotRoutesEnum } from '../../constants';
import { AutoExactHeightDirective, StorageService } from '../../../../common';
import { StartSessionPayload } from '../../models';
import { Router } from '@angular/router';
import { StorageKeys } from '../../../../shared';
import { UserContextService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'khawiik-instructions-next',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    AutoExactHeightDirective
  ],
  templateUrl: './khawiik-instructions-next.component.html',
  styleUrls: ['./khawiik-instructions-next.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikInstructionsNextComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  // ====== Dependencies ======
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _storageService = inject(StorageService);
  private readonly _userContextService = inject(UserContextService);
  private readonly router = inject(Router);
  // ====== SSR Check ======
  protected isBrowser: boolean;

  // ====== Inputs / Outputs ======
  @Input() chatType: 'text' | 'voice' = 'text';
  @Output() submit = new EventEmitter<StartSessionPayload & { chatType: 'text' | 'voice' }>();

  // ====== Configuration ======
  readonly keys = KHAWIIK_KEYS;

  // ====== State (signals) ======
  private readonly _draftText = signal('');
  readonly draftText = this._draftText.asReadonly();

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    // Reserved for future setup
  }

  // ====== Public / template actions ======
  protected onTextChange(event: Event): void {
    if (!this.isBrowser) return;

    const target = event.target as HTMLTextAreaElement;
    this._draftText.set(target.value);
  }

  protected onSubmit(): void {
    if (!this.isBrowser) return;

    const payload: StartSessionPayload & { chatType: 'text' | 'voice' } = {
      text: this.draftText().trim(),
      timestamp: new Date().toISOString(),
      chatType: this.chatType,
    };

    // Store SSR-safe data
    console.log('this._userContextService.user()?.user?.id', this._userContextService.user()?.user?.id);
    const currentUserInfo = this._storageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: { id?: string } } | null;
    this._storageService.setItem(StorageKeys.KHAWIAAK_USER, {
      userId: this._userContextService.user()?.user?.id || currentUserInfo?.user?.id,
      isStartKhawiaak: true,
    });

    // Navigate based on selected chat type
    if (this.chatType === 'text') {
      this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);
    } else if (this.chatType === 'voice') {
      this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.VOICE_CHAT]);
    }

    this.submit.emit(payload);
  }


  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.onSubmit();
    }
  }
}
