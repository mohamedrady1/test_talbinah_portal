import { IUserAuthenticationApiClient } from './i-user-authentication-api.client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ILoginRequestDto,
  ILoginResponseDto,
  IRegisterRequestDto,
  IRegisterResponseDto,
  IOtpVerificationResponseDto,
  IOtpVerificationRequestDto,
  ICheckNumberParams,
  ICheckNumberResponseDto,
  IMethodSelectionParams,
  IMethodSelectionResponseDto,
  IResetPasswordResponseDto,
  IResetPasswordRequestDto,
  IUpdateFcmParamsRequest,
  IUpdateFcmParamsResponse,
  ISendNotificationRequestDto,
  ISendNotificationResponsetDto,
  IAsGuestResponseDto
} from '../dtos';

import { CollectionApiClient } from '../../../../common/core/data-access';
import { UserManagementCollections } from '../collections';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationApiClient implements IUserAuthenticationApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      UserManagementCollections.Authentication,
      this.http
    );
  }

  checkNumer(params: ICheckNumberParams): Observable<ICheckNumberResponseDto> {
    return this.collectionApiClient.get({
      collectionName: UserManagementCollections.checkNumber(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  methodSelection(params: IMethodSelectionParams): Observable<IMethodSelectionResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.methodSelection(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  verifyCode(params: IOtpVerificationRequestDto): Observable<IOtpVerificationResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.VerifyCode(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  login(params: ILoginRequestDto | any): Observable<ILoginResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.Login(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  resetPassword(params: IResetPasswordRequestDto | any): Observable<IResetPasswordResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.resetPassword(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  //   login(body: ILoginRequestDto): Observable<ILoginResponseDto> {
  //     return this.collectionApiClient.post({ body, collectionSegment: 'login' });
  // }

  register(payload: IRegisterRequestDto): Observable<IRegisterResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.Register(),
      body: payload
    });
  }

  UpdateFcmNotifications(params: IUpdateFcmParamsRequest | any): Observable<IUpdateFcmParamsResponse> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.UpdateFcmNotifications(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  SendNotification(payload: ISendNotificationRequestDto): Observable<ISendNotificationResponsetDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.SendNotification(),
      body: payload
    });
  }

  asGuest(): Observable<IAsGuestResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UserManagementCollections.asGuest()
    });
  }
}
