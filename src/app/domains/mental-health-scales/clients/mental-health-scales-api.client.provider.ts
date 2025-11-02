import { MentalHealthScalesInMemoryApiClient } from './mental-health-scales-api.inmemory.client';
import { IMentalHealthScalesApiClient } from './i-mental-health-scales-api.client';
import { MentalHealthScalesApiClient } from './mental-health-scales-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MentalHealthScalesApiClientProvider extends ApiClientProvider<IMentalHealthScalesApiClient> {
  constructor(
    private client: MentalHealthScalesApiClient,
    private inMemoryClient: MentalHealthScalesInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IMentalHealthScalesApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IMentalHealthScalesApiClient {
    return this.inMemoryClient;
  }
}
