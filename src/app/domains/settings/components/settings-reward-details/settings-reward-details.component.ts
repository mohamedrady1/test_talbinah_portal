import {
  ChangeDetectionStrategy,
  Component,
  Input,
  PLATFORM_ID,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent, ToastService, PublicService } from '../../../../shared';
import { Logger } from '../../../../common';
import { RewardItem, RewardsAppointment, RewardsCoupon } from '../../dtos';

@Component({
  selector: 'app-settings-reward-details',
  standalone: true,
  imports: [TranslateModule, CommonModule, SvgIconComponent],
  templateUrl: './settings-reward-details.component.html',
  styleUrls: ['./settings-reward-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRewardDetailsComponent implements OnDestroy {
  @Input({ required: true }) rewardItem!: RewardItem;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(PublicService);
  protected readonly isBrowser = signal(isPlatformBrowser(this.platformId));

  protected activeTooltip: 'copy' | 'action' | null = null;
  protected tooltipId = 'settings-reward-tooltip';
  private tooltipTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly srMessage = signal('');

  ngOnDestroy(): void {
    this.clearTooltipTimer();
  }

  private clearTooltipTimer() {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
  }

  private copyCode(): boolean {
    if (!this.isBrowser() || !navigator?.clipboard) {
      Logger.warn('[rewardItem] Clipboard API not available.');
      return false;
    }

    const valueToCopy =
      this.rewardCouponCode ??
      (this.rewardItem?.gift?.id != null ? String(this.rewardItem.gift.id) : '');

    navigator.clipboard
      .writeText(valueToCopy)
      .then(() => {
        Logger.info('[rewardItem] Copied to clipboard.');
        this.srMessage.set(this.i18n.translateTextFromJson('settings.rewardItem.copySuccess'));
      })
      .catch((err) => {
        this.toast.add({
          severity: 'error',
          summary: this.i18n.translateTextFromJson('general.error'),
          detail: this.i18n.translateTextFromJson('settings.rewardItem.copyFailed'),
          life: 3000,
        });
        Logger.error('[rewardItem] Failed to copy:', err);
        this.srMessage.set(this.i18n.translateTextFromJson('settings.rewardItem.copyFailed'));
      });

    return true;
  }

  protected showTooltipFor(type: 'copy' | 'action') {
    if (!this.copyCode()) return;

    this.activeTooltip = type;
    this.clearTooltipTimer();

    this.tooltipTimer = setTimeout(() => {
      this.activeTooltip = null;
    }, 1000); // hide after 1 second
  }

  protected isCoupon(
    gift: RewardsCoupon | RewardsAppointment | null | undefined
  ): gift is RewardsCoupon {
    return !!gift && 'coupon' in gift;
  }

  get rewardCouponCode(): string | null {
    return this.isCoupon(this.rewardItem?.gift) ? this.rewardItem.gift.coupon : null;
  }
}
