export interface IResetPasswordRequestDto {
  phone_no: number | string;
  country_id: number | string;
  password: string;
  password_confirmation: string;
  role: 'user' | 'admin' | string; // adjust if you have a stricter role enum
  device_type: 'web' | 'android' | string;
  fcm_token?: string | null;
}
