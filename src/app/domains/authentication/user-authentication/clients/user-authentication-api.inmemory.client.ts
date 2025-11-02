import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
import { mockAuthData } from '../data/user-authentication.data';
import { IUserAuthenticationApiClient } from './i-user-authentication-api.client';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationInMemoryApiClient implements IUserAuthenticationApiClient {
  constructor(protected http: HttpClient) { }


  checkNumer(params: ICheckNumberParams): Observable<ICheckNumberResponseDto> {
    return of(mockAuthData.checkNumberResponse);
  }

  methodSelection(params: IMethodSelectionParams): Observable<IMethodSelectionResponseDto> {
    return of(mockAuthData.methodSelectionResponse);
  }

  verifyCode(payload: IOtpVerificationRequestDto): Observable<IOtpVerificationResponseDto> {
    // Ensure the response matches IOtpVerificationResponseDto type
    return of(mockAuthData.otpVerificationResponse as IOtpVerificationResponseDto);
  }

  login(payload: ILoginRequestDto): Observable<ILoginResponseDto> {
    return of(mockAuthData.loginResponse);
  }

  register(payload: IRegisterRequestDto): Observable<IRegisterResponseDto> {
    return of(mockAuthData.registerResponse);
  }

  resetPassword(payload: IResetPasswordRequestDto): Observable<IResetPasswordResponseDto> {
    return of(mockAuthData.resetPasswordResponse);
  }


  UpdateFcmNotifications(params: IUpdateFcmParamsRequest | any): Observable<IUpdateFcmParamsResponse> {
    return of();
  }

  SendNotification(payload: ISendNotificationRequestDto): Observable<ISendNotificationResponsetDto> {
    return of();
  }
  asGuest(): Observable<IAsGuestResponseDto> {
    return of(mockAuthData.AsGuestRespons);
  }
}
