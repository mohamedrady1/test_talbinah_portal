import {
  ChangeDetectionStrategy,
  Component,
  Input,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastService, PublicService, ShareSocialComponent } from '../../../../shared';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-invitation-code',
  standalone: true,
  imports: [
    CommonModule,
    ShareSocialComponent,
    TranslateApiPipe
  ],
  styleUrls: ['./invitation-code.component.scss'],
  templateUrl: './invitation-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationCodeComponent {
  @Input({ required: true }) invitationCode!: string;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(PublicService);
  readonly isBrowser = signal(isPlatformBrowser(this.platformId));

  copyCodeToClipboard(): void {
    if (!this.isBrowser() || typeof navigator === 'undefined' || !navigator.clipboard) {
      Logger.warn('[InvitationCode] Clipboard API not available.');
      return;
    }

    navigator.clipboard.writeText(this.invitationCode)
      .then(() => {
        this.toast.add({
          severity: 'success',
          summary: this.i18n.translateTextFromJson('general.success'),
          detail: this.i18n.translateTextFromJson('referral_code_copied_success'),
          life: 3000
        });
        Logger.info('[InvitationCode] Copied to clipboard.');
      })
      .catch((err) => {
        this.toast.add({
          severity: 'error',
          summary: this.i18n.translateTextFromJson('general.error'),
          detail: this.i18n.translateTextFromJson('referral_code_copy_failed'),
          life: 3000
        });
        Logger.error('[InvitationCode] Failed to copy:', err);
      });
  }
}
