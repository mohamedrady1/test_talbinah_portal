import { Component, Input, Signal, computed, inject, PLATFORM_ID, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IPaymentMethod, PaymentMethodsEnum } from '../../../domains';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-radio-card',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './radio-card.component.html',
  styleUrls: ['./radio-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioCardComponent {
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);

  @Input({ required: true }) config!: IPaymentMethod;

  @Input({ required: true }) selectedValueId!: Signal<string | null>;

  @Output() selectedChange = new EventEmitter<IPaymentMethod>();

  // Expose enum directly if needed in template for specific comparisons (e.g., PaymentMethodsEnum.CASH)
  protected paymentMethods = PaymentMethodsEnum;


  readonly isChecked = computed(() => {
    return this.selectedValueId() === this.config.id.toString();
  });

  protected onSelect(): void {
    if (this.isBrowser) {
      this.selectedChange.emit(this.config);
    }
  }
}
