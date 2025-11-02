export interface IOtpVerificationRequestDto {
  phone_no: string | number;
  country_id: string | number;
  country_code?: string | number;
  code: string | number;
}
