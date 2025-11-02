export interface IMethodSelectionParams {
  phone_no: number | string;
  country_id: number | string;
  country_code?: string | number;
  channel: string;
  role: 'user' | 'admin' | string; // adjust if you have a stricter role enum
  device_type: 'web' | 'android' | string;
  'g-recaptcha-response': string;
  platform: 'browser' | 'server' | string;
  app_type: string;
}
