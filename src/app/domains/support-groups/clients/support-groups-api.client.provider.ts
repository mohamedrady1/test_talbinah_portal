import { SupportGroupsInMemoryApiClient } from './support-groups-api.inmemory.client';
import { ISupportGroupsApiClient } from './i-support-groups-api.client';
import { SupportGroupsApiClient } from './support-groups-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SupportGroupsApiClientProvider extends ApiClientProvider<ISupportGroupsApiClient> {
  constructor(
    private client: SupportGroupsApiClient,
    private inMemoryClient: SupportGroupsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ISupportGroupsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ISupportGroupsApiClient {
    return this.inMemoryClient;
  }
}
