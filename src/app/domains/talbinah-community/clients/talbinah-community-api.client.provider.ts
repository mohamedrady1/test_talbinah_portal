import { TalbinahCommunityInMemoryApiClient } from './talbinah-community-api.inmemory.client';
import { ITalbinahCommunityApiClient } from './i-talbinah-community-api.client';
import { TalbinahCommunityApiClient } from './talbinah-community-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TalbinahCommunityApiClientProvider extends ApiClientProvider<ITalbinahCommunityApiClient> {
  constructor(
    private client: TalbinahCommunityApiClient,
    private inMemoryClient: TalbinahCommunityInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ITalbinahCommunityApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ITalbinahCommunityApiClient {
    return this.inMemoryClient;
  }
}
