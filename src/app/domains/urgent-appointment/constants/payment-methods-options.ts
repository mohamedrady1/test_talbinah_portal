import { PaymentMethodsEnum } from "../enums";

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: `PaymentMethods.Wallet`,
    value: PaymentMethodsEnum?.CASH,
    icon: 'images/payment-methods/wallet.svg'
  },
  {
    label: `PaymentMethods.Points`,
    value: PaymentMethodsEnum?.POINT,
    icon: 'images/payment-methods/coin.svg'
  },
  {
    label: `PaymentMethods.card`,
    value: PaymentMethodsEnum?.CREDIT_CARD,
    icon: 'images/payment-methods/cards.svg'
  }
];
