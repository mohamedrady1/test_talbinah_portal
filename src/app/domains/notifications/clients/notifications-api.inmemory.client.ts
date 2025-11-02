import { INotificationsApiClient } from './i-notifications-api.client';
import { INotificationsListingResponseDto, IPreferredMsgChannelResponseDto, IMarkNotificationReadResponseDto } from '../dtos';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPaginationParameters } from '../../../common';
import { mockNotificationsListing, mockPreferredMsgChannelResponse } from '../data';

@Injectable({ providedIn: 'root' })
export class NotificationsInMemoryApiClient implements INotificationsApiClient {

  getAll(paginationParameters?: IPaginationParameters): Observable<INotificationsListingResponseDto> {
    return of(mockNotificationsListing);
  }

  updatePreferredMsgChannel(params?: any): Observable<IPreferredMsgChannelResponseDto> {
    return of(mockPreferredMsgChannelResponse);
  }

  markAsRead(notificationId: number): Observable<IMarkNotificationReadResponseDto> {
    return of({
      status: true,
      message: null,
      data: true
    });
  }
}
