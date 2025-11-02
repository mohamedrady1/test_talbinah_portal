import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../../common';
import { IPaymentMethodOption } from '../../interfaces';
import { PAYMENT_METHOD_OPTIONS } from '../../constants';

interface DiscountFormModel {
  code: number;
}

interface PaymentMethodsFormModel {
  paymentMethod: string;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  private readonly fb = inject(FormBuilder);

  readonly discountForm: FormGroup = this.fb.group({
    code: [null, Validators.required],
  });
  readonly isLoadingDiscount = signal(false);


  protected onSubmitDiscountForm(): void {
    if (this.discountForm.valid) {
      const payload = this.discountForm.getRawValue() as DiscountFormModel;
      Logger.debug('Discount Form Submitted:', payload);
      // TODO: submit payload
    } else {
      Logger.debug('Discount Form is invalid');
      this.discountForm.markAllAsTouched();
    }
  }


  readonly paymentMethodsList: IPaymentMethodOption[] = PAYMENT_METHOD_OPTIONS;
  readonly paymentMethodsForm: FormGroup = this.fb.group({
    paymentMethod: [null, Validators.required],
  });
  readonly isLoadingPaymentMethods = signal(false);

  protected onSubmitPaymentMethodsForm(): void {
    if (this.paymentMethodsForm.valid) {
      const payload = this.paymentMethodsForm.getRawValue() as PaymentMethodsFormModel;
      Logger.debug('Payment Form Submitted:', payload);
      // TODO: submit payload
    } else {
      Logger.debug('Payment Form is invalid');
      this.paymentMethodsForm.markAllAsTouched();
    }
  }

}
