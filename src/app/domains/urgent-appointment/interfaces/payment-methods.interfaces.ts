import { PaymentMethodsEnum } from "../enums";

export interface IPaymentMethodOption {
  label: string;
  value: PaymentMethodsEnum;
  icon: string;
}
