import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChargeWalletFacade } from '../../services/charge-wallet.facade';
import { CommonModule } from '@angular/common';
import { Logger, NavigationIntent, useNavigation } from '../../../../common';

@Component({
  selector: 'app-charge-wallet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './charge-wallet.component.html',
  styleUrls: ['./charge-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargeWalletComponent {
  protected readonly _ChargeWalletFacade = inject(ChargeWalletFacade);

  private readonly nav = useNavigation();

  protected chargeForm: FormGroup;
  protected isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.chargeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });

    effect(() => {
      if (!this._ChargeWalletFacade.isLoading() && this._ChargeWalletFacade.isSuccess()) {
        Logger.debug('ChargeWalletComponent | Charge Wallet Facade | Response: ', this._ChargeWalletFacade.response());
        if (this._ChargeWalletFacade.response() && this._ChargeWalletFacade.response()?.data && this._ChargeWalletFacade.response()?.data?.url) {
          this.nav.navigate(
            NavigationIntent.EXTERNAL_SAME_TAB,
            this._ChargeWalletFacade.response()?.data?.url ?? ''
          );
        }
      }
    });
  }

  get amountControl() {
    return this.chargeForm.get('amount');
  }

  get amountError(): string {
    const control = this.amountControl;
    if (control?.errors && this.isSubmitted) {
      if (control.errors['required']) {
        return 'PaymentMethods.enterAmount';
      }
      if (control.errors['min']) {
        return 'PaymentMethods.enterAmount';
      }
      if (control.errors['pattern']) {
        return 'PaymentMethods.enterAmount';
      }
    }
    return '';
  }

  protected onSubmit(): void {
    this.isSubmitted = true;
    if (this.chargeForm.invalid) {
      this.chargeForm.markAllAsTouched();
      return;
    }
    else {
      const amount = this.chargeForm.get('amount')?.value;
      console.log('Deposit amount:', amount);
      this._ChargeWalletFacade.chargeWallet(amount);
    }
  }
}
