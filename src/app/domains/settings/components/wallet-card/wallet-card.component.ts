import { Component, Input, signal, computed, inject, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule, NgIf, NgStyle, NgClass, formatDate } from '@angular/common';
import { ClipboardService } from '../../../../shared/services';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { MovementItem } from '../../dtos/responses/movements-response.dto';
import { LocalizationService } from '../../../../shared';
import { TranslationsFacade } from '../../../../common/core/translations/services';

export type CardType = 'shipping' | 'withdrawal';

export interface CardConfig {
  type: CardType;
  trackingNumber?: string;
  phoneNumber?: string;
  amount: number;
  date: string;
  time: string;
  withdrawalDescription?: string;
  doctorName?: string;
}
@Component({
  selector: 'app-wallet-card',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    
  ],
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Input({ required: true }) cardConfig !: MovementItem;
  @Input({ required: true }) phoneNumber !: string;

  private clipboardService = inject(ClipboardService);
  private readonly localization = inject(LocalizationService);
  readonly currentLanguage = this.localization.getCurrentLanguage();

  protected tooltipVisible = signal(false);
  protected tooltipTimeout!: ReturnType<typeof setTimeout>;

  private parseAsUTC(dateString: string): Date {
    const [y, m, d, h, min, s] = dateString.split(/[-T:]/).map(Number);
    return new Date(Date.UTC(y, m - 1, d, h, min, s || 0));
  }

  get formattedDate(): string {
    return formatDate(this.parseAsUTC(this.cardConfig.time), 'd MMMM y', this.currentLanguage, 'UTC');
  }

  get formattedTime(): string {
    return formatDate(this.parseAsUTC(this.cardConfig.time), 'hh:mm a', this.currentLanguage, 'UTC');
  }

  protected copyTrackingNumber(trackingNumber: string): void {
    if (!trackingNumber) return;

    this.clipboardService.copyToClipboard(trackingNumber);

    this.tooltipVisible.set(true);

    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.tooltipVisible.set(false);
    }, 1000);
  }

}

