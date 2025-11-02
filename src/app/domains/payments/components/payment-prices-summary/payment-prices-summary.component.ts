import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, OnInit, computed, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalizationService, SvgIconComponent, ToastService, ErrorStateCardComponent, ErrorStateConfig } from "../../../../shared";
import { CalculateReservationPriceFacade } from '../../../appointments';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentFlowService } from '../../services';
import { IPaymentSummary } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { getDiscountErrorConfig } from '../../configs/discount-error-state.config';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-payment-prices-summary',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    SvgIconComponent,
    ReactiveFormsModule,
    ErrorStateCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './payment-prices-summary.component.html',
  styleUrls: ['./payment-prices-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentPricesSummaryComponent implements OnInit {
  private readonly paymentFlowService = inject(PaymentFlowService);
  private readonly _CalculateReservationPriceFacade = inject(CalculateReservationPriceFacade);
  private readonly toastService = inject(ToastService);

  @Input() dataSummary = signal<IPaymentSummary>({
    paymentType: null,
    reservationsSummary: null,
    item: undefined
  });

  @Input() isLoading: boolean = false;
  @Input() type: string = '';

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() discountApplied = new EventEmitter<string>();
  @Output() discountRemoved = new EventEmitter<void>();

  protected hasError = signal<boolean>(false);
  protected discountForm: FormGroup;
  protected isLoadingDiscount = signal(false);
  protected isDiscountApplied = signal<boolean>(false);

  protected discountSuccessMessage = signal<string | null>(null);
  protected discountErrorMessage = this._CalculateReservationPriceFacade.calculationError;
  protected readonly localization = inject(LocalizationService);
  protected couponErrorMessage = signal<string | null>(null);
  protected shouldShowDiscountSection = computed(() => {
    return (this.type === 'book-appointment' || this.type === 'therapeutic-programs') && this.dataSummary()?.paymentType?.id !== 7;
  });

  protected discountErrorState = computed<ErrorStateConfig>(() =>
    getDiscountErrorConfig(
      this.discountErrorMessage() || undefined,
      () => this.removeDiscount()
    )
  );

  constructor(private formBuilder: FormBuilder) {
    this.discountForm = this.formBuilder.group({
      code: ['', [Validators.required]]
    });

    // React to isCalculatingPrice from facade
    effect(() => {
      const loading = this._CalculateReservationPriceFacade.isCalculatingPrice();
      this.isLoadingDiscount.set(loading);

      if (!loading) {
        const response = this._CalculateReservationPriceFacade.calculatedPriceResponse();
        if (response?.data) {
          if (response.data.coupon_id && !response.data.couponErrorMessage) {
            this.discountSuccessMessage.set(response?.message || this.localization.translateTextFromJson('paymentDetailsCard.discountSuccessMessage'));
            this.isDiscountApplied.set(true);
            this.dataSummary.update(old => ({
              ...old,
              reservationsSummary: response.data?.payments
            }));
          } else if (response.data.couponErrorMessage) {
            this.discountSuccessMessage.set(null);
            this.isDiscountApplied.set(false);
            // Clear the coupon input when error occurs
            this.discountForm.get('code')?.setValue(null);
            this.couponErrorMessage.set(response.data.couponErrorMessage);
          } else {
            this.discountSuccessMessage.set(null);
            this.isDiscountApplied.set(false);
          }
        }
      }
      if (this.discountErrorMessage()) {
        this.discountErrorState().title = this.discountErrorMessage() ?? '';
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('PaymentPricesSummaryComponent initialized with dataSummary:', this.dataSummary());
    Logger.debug('PaymentPricesSummaryComponent initialized with type:', this.type);
  }

  protected applyDiscount(): void {
    if (this.discountForm.valid) {
      const discountCode = this.discountForm.get('code')?.value;
      Logger.debug('PaymentPricesSummaryComponent: Applying discount code:', discountCode);

      // Emit to parent so PaymentPopup -> PaymentFlowService -> facade handles it
      this.discountApplied.emit(discountCode);
    } else {
      this.discountForm.markAllAsTouched();
    }
  }

  protected removeDiscount(): void {
    Logger.debug('PaymentPricesSummaryComponent: Removing discount');

    // Get current error message before clearing
    const currentErrorMessage = this.discountErrorMessage();

    // Reset form and state
    this.discountForm.get('code')?.setValue(null);
    this.isDiscountApplied.set(false);
    this.discountSuccessMessage.set(null);
    this.couponErrorMessage.set(null);
    // Emit to parent to remove discount
    this.discountRemoved.emit();
  }

  protected onCancel(): void {
    this.back.emit();
  }

  protected onNext(): void {
    if (!this.dataSummary) {
      this.hasError.set(true);
    } else {
      this.hasError.set(false);
      this.next.emit();
    }
  }
}
