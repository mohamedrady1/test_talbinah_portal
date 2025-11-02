import { Component, EventEmitter, inject, Output, signal, OnInit, computed, ChangeDetectionStrategy, Input } from '@angular/core';
import { IPaymentMethod, PaymentMethodsFacade } from '../../../../domains';
import { TranslateModule } from '@ngx-translate/core';
import { RadioCardComponent } from '../radio-card';
import { Logger } from '../../../../common';
import { CommonModule } from '@angular/common';
import { EmptyStateConfig, ErrorStateConfig, EmptyStateComponent, ErrorStateComponent } from '../../../../shared';
// No need for CommonModule here if only using @if, @for, as standalone components have them implicitly
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
  imports: [CommonModule, RadioCardComponent, TranslateModule, EmptyStateComponent, ErrorStateComponent, ], // Removed CommonModule as it's implicitly available for standalone
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Apply OnPush strategy for performance
})
export class PaymentMethodComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  

  @Input() isLoading: boolean = false;
  /**
   * Emits the selected IPaymentMethod when a radio card is specifically chosen.
   */
  @Output() selectedChange = new EventEmitter<IPaymentMethod>();

  /**
   * Emits the selected IPaymentMethod when the 'Next' button is clicked.
   * This signals to the parent to proceed with the selected payment method.
   */
  @Output() onNext = new EventEmitter<IPaymentMethod>(); // Renamed for clarity from onNextEmitter

  /**
   * Emits a signal to add a new card (if applicable in the workflow).
   * Note: Original output type was `string`, changed to `void` as typically it's just a trigger.
   * Adjust back to `string` if specific data is needed (e.g., 'credit_card_type').
   */
  @Output() addNewCard = new EventEmitter<void>();

  /**
   * Emits a signal when the 'Cancel' button is clicked.
   */
  @Output() close = new EventEmitter<void>();

  // --- Dependencies ---
  private paymentMethodsFacade = inject(PaymentMethodsFacade);

  // --- Component State Signals ---
  /** Holds the currently selected payment method object. */
  protected selectedMethod = signal<IPaymentMethod | null>(null);

  /** Indicates if a validation error (no method selected) should be shown. */
  protected validationError = signal(false);

  /** Indicates if the 'Next' button is in a loading state. */
  protected isNextButtonLoading = signal(false); // Added for button loading state

  // --- Computed Signals for Template & Child Components ---
  /**
   * Exposes the list of available payment methods from the facade.
   */
  readonly paymentMethods = this.paymentMethodsFacade.paymentMethods;

  /**
   * Indicates if payment methods are currently being loaded.
   */
  readonly isLoadingPaymentMethods = this.paymentMethodsFacade.isLoading;

  /**
   * Provides the status of the payment methods fetch operation.
   */
  readonly paymentMethodsStatus = this.paymentMethodsFacade.status;

  /**
   * Holds any error message from fetching payment methods.
   */
  readonly paymentMethodsErrorMessage = this.paymentMethodsFacade.errorMessage;

  paymentMethodsEmptyState = paymentMethodsEmptyState;
  protected readonly paymentMethodsErrorState = getPaymentMethodsError(() => this.paymentMethodsFacade.fetchPaymentMethods());

  /**
   * Computed signal that extracts the string ID of the selected method.
   * This is passed to `RadioCardComponent`'s `selectedValueId` input.
   */
  protected selectedMethodId = computed(() => {
    return this.selectedMethod()?.id?.toString() || null;
  });

  constructor() {
    // Constructor for dependency injection. Initialization logic is in ngOnInit.
  }

  /**
   * Lifecycle hook: Fetches payment methods when the component is initialized.
   */
  ngOnInit(): void {
    this.paymentMethodsFacade.fetchPaymentMethods();
  }

  /**
   * Handles the `selectedChange` event emitted by `RadioCardComponent`.
   * Updates the `selectedMethod` signal and clears any validation errors.
   * @param method The `IPaymentMethod` object that was selected.
   */
  protected handleRadioCardSelection(method: IPaymentMethod): void {
    this.selectedMethod.set(method);
    this.selectedChange.emit(method); // Emit the selection to its own parent immediately
    this.validationError.set(false); // Clear error when a selection is made
    Logger.debug('PaymentMethodComponent: Selected method:', this.selectedMethod());
  }

  /**
   * Handler for the 'Next' button click.
   * Validates if a method is selected, then emits the selected method to proceed.
   */
  protected onNextStep(): void {
    if (!this.selectedMethod()) {
      this.validationError.set(true); // Show validation error if no method is selected
      Logger.warn('PaymentMethodComponent: Please select a payment method before proceeding.');
    } else {
      this.isNextButtonLoading.set(true); // Start loading animation
      this.validationError.set(false); // Clear error if valid selection

      // Simulate an asynchronous operation, replace with your actual subscription logic
      // For demonstration, let's use a setTimeout. In a real scenario, this would be
      // a service call that returns an Observable.
      this.onNext.emit(this.selectedMethod()!); // Emit the selected method to the parent
      Logger.debug('PaymentMethodComponent: Proceeding with selected method:', this.selectedMethod());
      this.isNextButtonLoading.set(false); // Stop loading animation after operation
    }
  }

  /**
   * Handler for the 'Add New Card' button click (if uncommented in template).
   * Emits a signal to the parent to open the add card flow.
   */
  protected onAddNewCard(): void {
    this.addNewCard.emit(); // Emits void (or specific string if needed)
    Logger.debug('PaymentMethodComponent: Add new card initiated.');
  }

  /**
   * Handler for the 'Cancel' button click.
   * Emits a signal to the parent to close/cancel the payment process.
   */
  protected onCancel(): void {
    this.close.emit();
    Logger.debug('PaymentMethodComponent: Payment method selection cancelled.');
  }
}

