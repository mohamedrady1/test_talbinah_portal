import { TalbinahBotInMemoryApiClient } from './talbinah-bot-api.inmemory.client';
import { ITalbinahBotApiClient } from './i-talbinah-bot-api.client';
import { TalbinahBotApiClient } from './talbinah-bot-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TalbinahBotApiClientProvider extends ApiClientProvider<ITalbinahBotApiClient> {
  constructor(
    private client: TalbinahBotApiClient,
    private inMemoryClient: TalbinahBotInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ITalbinahBotApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ITalbinahBotApiClient {
    return this.inMemoryClient;
  }
}
