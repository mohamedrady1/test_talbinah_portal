import { Injectable } from '@angular/core';
import { ICustomersApiClient } from './i-customers-api.client';
import { CustomersApiClient } from './customers-api.client';
import { CustomersInMemoryApiClient } from './customers-api.inmemory.client';
import { ApiClientProvider } from '../../../common/core/data-access';
@Injectable({
  providedIn: 'root'
})
export class CustomersApiClientProvider extends ApiClientProvider<ICustomersApiClient> {
  constructor(
    private client: CustomersApiClient,
    private inMemoryClient: CustomersInMemoryApiClient
  ) {
    super();
  }

  protected override getInMemoryClient(): ICustomersApiClient {
    return this.inMemoryClient;
  }
  protected override getApiClient(): ICustomersApiClient {
    return this.client;
  }
}
