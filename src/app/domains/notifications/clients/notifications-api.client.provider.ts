import { NotificationsInMemoryApiClient } from './notifications-api.inmemory.client';
import { INotificationsApiClient } from './i-notifications-api.client';
import { NotificationsApiClient } from './notifications-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationsApiClientProvider extends ApiClientProvider<INotificationsApiClient> {
  constructor(
    private client: NotificationsApiClient,
    private inMemoryClient: NotificationsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): INotificationsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): INotificationsApiClient {
    return this.inMemoryClient;
  }
}
