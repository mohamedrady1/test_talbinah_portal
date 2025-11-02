import { PodcastsInMemoryApiClient } from './podcasts-api.inmemory.client';
import { IPodcastsApiClient } from './i-podcasts-api.client';
import { PodcastsApiClient } from './podcasts-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PodcastsApiClientProvider extends ApiClientProvider<IPodcastsApiClient> {
  constructor(
    private client: PodcastsApiClient,
    private inMemoryClient: PodcastsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IPodcastsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IPodcastsApiClient {
    return this.inMemoryClient;
  }
}
