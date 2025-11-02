import { Observable } from 'rxjs';
import {
  IAsGuestResponseDto,
  ICheckNumberParams,
  ICheckNumberResponseDto,
  ILoginRequestDto,
  ILoginResponseDto,
  IMethodSelectionParams,
  IMethodSelectionResponseDto,
  IOtpVerificationRequestDto,
  IOtpVerificationResponseDto,
  IRegisterRequestDto,
  IRegisterResponseDto,
  IResetPasswordRequestDto,
  IResetPasswordResponseDto,
  ISendNotificationRequestDto,
  ISendNotificationResponsetDto,
  IUpdateFcmParamsRequest,
  IUpdateFcmParamsResponse
} from '../dtos';

export interface IUserAuthenticationApiClient {
  checkNumer(params: ICheckNumberParams): Observable<ICheckNumberResponseDto>;
  methodSelection(params: IMethodSelectionParams): Observable<IMethodSelectionResponseDto>;
  verifyCode(params: IOtpVerificationRequestDto): Observable<IOtpVerificationResponseDto>;
  login(params: ILoginRequestDto): Observable<ILoginResponseDto>;
  resetPassword(params: IResetPasswordRequestDto): Observable<IResetPasswordResponseDto>;

  register(payload: IRegisterRequestDto): Observable<IRegisterResponseDto>;

  UpdateFcmNotifications(params: IUpdateFcmParamsRequest): Observable<IUpdateFcmParamsResponse>;
  SendNotification(payload: ISendNotificationRequestDto): Observable<ISendNotificationResponsetDto>;
  asGuest(): Observable<IAsGuestResponseDto>;
}
