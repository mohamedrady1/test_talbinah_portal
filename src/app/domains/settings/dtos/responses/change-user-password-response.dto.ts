export interface IChangePasswordResponseDto {
  status: boolean;
  message?: string | null;
  data?: {
    success: boolean;
    message?: string;
  } | null;
}
