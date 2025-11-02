import { PaymentsInMemoryApiClient } from './payments-api.inmemory.client';
import { IPaymentsApiClient } from './i-payments-api.client';
import { PaymentsApiClient } from './payments-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentsApiClientProvider extends ApiClientProvider<IPaymentsApiClient> {
  constructor(
    private client: PaymentsApiClient,
    private inMemoryClient: PaymentsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IPaymentsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IPaymentsApiClient {
    return this.inMemoryClient;
  }
}
