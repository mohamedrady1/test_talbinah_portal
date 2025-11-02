import { IPaginationParameters } from '../../../common';
import { Observable } from 'rxjs';
import { INotificationsListingResponseDto, IPreferredMsgChannelResponseDto, IMarkNotificationReadResponseDto } from '../dtos';

export interface INotificationsApiClient {
  getAll: (paginationParameters?: IPaginationParameters) => Observable<INotificationsListingResponseDto>;
  updatePreferredMsgChannel: (params?: any) => Observable<IPreferredMsgChannelResponseDto>;
  markAsRead: (notificationId: number) => Observable<IMarkNotificationReadResponseDto>;
}
