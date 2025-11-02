import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';
import { IAppointmentsApiClient } from './i-appointments-api.client';
import { AppointmentsApiClient } from './appointments-api.client';
import { AppointmentsListingInMemoryApiClient } from './appointments-api.inmemory.client';

@Injectable({ providedIn: 'root' })
export class AppointmentsApiClientProvider extends ApiClientProvider<IAppointmentsApiClient> {
  constructor(
    private client: AppointmentsApiClient,
    private inMemoryClient: AppointmentsListingInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IAppointmentsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IAppointmentsApiClient {
    return this.inMemoryClient;
  }
}
