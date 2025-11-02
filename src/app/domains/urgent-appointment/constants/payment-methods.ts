import { IPaymentMethodOption } from "../interfaces";
import { PaymentMethodsEnum } from "../enums";

export const PAYMENT_METHOD_OPTIONS: IPaymentMethodOption[] = [
  {
    label: `PaymentMethods.Wallet`,
    value: PaymentMethodsEnum?.CASH,
    icon: 'images/payment-methods/wallet.svg'
  },
  {
    label: `PaymentMethods.Point`,
    value: PaymentMethodsEnum?.POINT,
    icon: 'images/payment-methods/coin.svg'
  },
  {
    label: `PaymentMethods.Card`,
    value: PaymentMethodsEnum?.CREDIT_CARD,
    icon: 'images/payment-methods/cards.svg'
  }
];
