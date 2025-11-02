import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { IGlobalDoctorCopounModel, Position, TriggerTypes, Logger } from '../../../../common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent, TooltipComponent } from '../../../../shared';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-discount-card-for-meeting-chat',
  standalone: true,
  imports: [
    SvgIconComponent,
    TooltipComponent,
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './discount-card-for-meeting-chat.component.html',
  styleUrls: ['./discount-card-for-meeting-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountCardForMeetingChatComponent {
  @Input() item: IGlobalDoctorCopounModel | null = null;

  protected readonly Position = Position;
  protected readonly trigger = TriggerTypes;
  private readonly platformId = inject(PLATFORM_ID);
  @Input() allowShortTexts!: boolean | null;

  protected copyToClipboard(): void {
    if (!this.item?.coupon) {
      Logger.warn('DiscountCodeCardComponent: No coupon code to copy.');
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const couponCode = this.item.coupon;
      let textarea: HTMLTextAreaElement | undefined;

      try {
        textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.value = couponCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        Logger.debug('DiscountCodeCardComponent => Copied to clipboard (execCommand):', couponCode);
      } catch (err) {
        Logger.error('DiscountCodeCardComponent => Failed to copy to clipboard:', err);
      } finally {
        if (textarea) {
          document.body.removeChild(textarea);
        }
      }
    } else {
      Logger.debug('DiscountCodeCardComponent => Copy to clipboard not available on server-side.');
    }
  }
}
