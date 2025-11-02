export interface ILoginRequestDto {
  phone_no: number | string;
  country_id: number | string;
  password: string;
  fcm_token: string | null;
  device_type: string | null;
}
