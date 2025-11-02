import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Logger } from '../../../../common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IPaymentSummary } from '../../../payments';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-wallet-confirmation',
  standalone: true,
  imports: [TranslateModule, CommonModule,],
  templateUrl: './wallet-confirmation.component.html',
  styleUrls: ['./wallet-confirmation.component.scss']
})
export class WalletConfirmationComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input() dataSummary = signal<IPaymentSummary>({
    paymentType: null,
    reservationsSummary: null,
    item: undefined
  });
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  error = signal(false);

  @Input() isLoading: boolean = false; // NEW: Input to receive loading state

  ngOnInit(): void {
    Logger.debug('Data Summary: ', this.dataSummary);
  }

  protected onCancel(): void {
    this.back.emit();
  }
  protected onNext(): void {
    if (!this.dataSummary) {
      this.error.set(true);
    } else {
      this.error.set(false);
      this.next.emit();
    }
  }

}

