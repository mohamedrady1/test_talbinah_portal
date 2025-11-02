import { TechnicalSupportInMemoryApiClient } from './technical-support-api.inmemory.client';
import { TechnicalSupportApiClient } from './technical-support-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';
import { ITechnicalSupportApiClient } from './i-technical-support-api.client';

@Injectable({ providedIn: 'root' })
export class TechnicalSupportApiClientProvider extends ApiClientProvider<ITechnicalSupportApiClient> {
  constructor(
    private client: TechnicalSupportApiClient,
    private inMemoryClient: TechnicalSupportInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ITechnicalSupportApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ITechnicalSupportApiClient {
    return this.inMemoryClient;
  }
}
