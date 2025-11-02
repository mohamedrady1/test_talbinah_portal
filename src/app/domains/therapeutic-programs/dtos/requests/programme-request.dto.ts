
export interface IStoreProgrammeRequestDto {
  programme_id: number;
  payment_id: number;
  coupon_id?: number | null;
  device_type?: string;
  web_type?: string
}
