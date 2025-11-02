import { EmptyStateConfig, ErrorStateConfig, EmptyStateComponent, ErrorStateComponent, RadioCardComponent, SvgIconComponent } from '../../../../shared';
import { Component, EventEmitter, inject, Output, signal, OnInit, computed, ChangeDetectionStrategy, Input } from '@angular/core';
import { IPaymentMethod, PaymentMethodsFacade } from '../../../../domains';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

export const paymentMethodsEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/paymentMethods/no-payment.svg',
  title: 'support_groups_payment_methods_empty_state',
  gap: '.5rem'
};

export function getPaymentMethodsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/paymentMethods/no-payment-error.svg',
    title: 'support_groups_payment_methods_error_state',
    gap: '.5rem',
    onRetry
  };
}

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    RadioCardComponent,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    SvgIconComponent
  ],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);

  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  @Input() isLoading: boolean = false;
  @Input() type: string = '';
  @Output() selectedChange = new EventEmitter<IPaymentMethod>();
  @Output() onNext = new EventEmitter<IPaymentMethod>();
  @Output() close = new EventEmitter<void>();

  // --- Dependencies ---
  private paymentMethodsFacade = inject(PaymentMethodsFacade);
  private formBuilder = inject(FormBuilder);

  // --- Component State Signals ---
  /** Holds the currently selected payment method object. */
  protected selectedMethod = signal<IPaymentMethod | null>(null);

  /** Indicates if a validation error (no method selected) should be shown. */
  protected validationError = signal(false);

  /** Indicates if the 'Next' button is in a loading state. */
  protected isNextButtonLoading = signal(false);

  // --- Computed Signals for Template & Child Components ---
  readonly paymentMethods = this.paymentMethodsFacade.paymentMethods;
  readonly isLoadingPaymentMethods = this.paymentMethodsFacade.isLoading;
  readonly paymentMethodsStatus = this.paymentMethodsFacade.status;
  readonly paymentMethodsErrorMessage = this.paymentMethodsFacade.errorMessage;

  paymentMethodsEmptyState = paymentMethodsEmptyState;
  protected readonly paymentMethodsErrorState = getPaymentMethodsError(() => this.paymentMethodsFacade.fetchPaymentMethods());

  protected selectedMethodId = computed(() => {
    return this.selectedMethod()?.id?.toString() || null;
  });

  constructor() {
    // Constructor for dependency injection
  }

  ngOnInit(): void {
    this.paymentMethodsFacade.fetchPaymentMethods();
  }

  protected handleRadioCardSelection(method: IPaymentMethod): void {
    this.selectedMethod.set(method);
    this.selectedChange.emit(method);
    this.validationError.set(false);
    Logger.debug('PaymentMethodComponent: Selected method:', this.selectedMethod());
  }

  protected onNextStep(): void {
    if (!this.selectedMethod()) {
      this.validationError.set(true);
      Logger.warn('PaymentMethodComponent: Please select a payment method before proceeding.');
    } else {
      this.isNextButtonLoading.set(true);
      this.validationError.set(false);

      this.onNext.emit(this.selectedMethod()!);
      Logger.debug('PaymentMethodComponent: Proceeding with selected method:', this.selectedMethod());
      this.isNextButtonLoading.set(false);
    }
  }

  protected onCancel(): void {
    this.close.emit();
    Logger.debug('PaymentMethodComponent: Payment method selection cancelled.');
  }
}
