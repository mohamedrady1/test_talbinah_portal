import { INotificationsApiClient } from "./i-notifications-api.client";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { INotificationsListingResponseDto, IPreferredMsgChannelResponseDto, IMarkNotificationReadResponseDto } from "../dtos";
import { NotificationsManagementCollections } from "../collections";

@Injectable({ providedIn: 'root' })
export class NotificationsApiClient implements INotificationsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      NotificationsManagementCollections.Seminars,
      this.http
    );
  }

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<INotificationsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: NotificationsManagementCollections.getAllNotifications(),
      paginationParameters
    });
  }

  updatePreferredMsgChannel(params?: any): Observable<IPreferredMsgChannelResponseDto> {
    return this.collectionApiClient.get({
      collectionName: NotificationsManagementCollections.getAllNotifications(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  markAsRead(notificationId: number): Observable<IMarkNotificationReadResponseDto> {
    return this.collectionApiClient.post({
      collectionName: NotificationsManagementCollections.markNotificationAsRead(),
      body: { notification_id: notificationId },
      requestOptions: {
        params: { notification_id: notificationId }
      }
    });
  }
}
