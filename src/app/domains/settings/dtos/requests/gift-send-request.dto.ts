export interface IGiftSendRequestDto {
  phone: string;
  amount: number;
  country_id?: number;
  payment_id?: number;
}
