import { UrgentAppointmentInMemoryApiClient } from './urgent-appointment-api.inmemory.client';
import { IUrgentAppointmentApiClient } from './i-urgent-appointment-api.client';
import { UrgentAppointmentApiClient } from './urgent-appointment-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UrgentAppointmentApiClientProvider extends ApiClientProvider<IUrgentAppointmentApiClient> {
  constructor(
    private client: UrgentAppointmentApiClient,
    private inMemoryClient: UrgentAppointmentInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IUrgentAppointmentApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IUrgentAppointmentApiClient {
    return this.inMemoryClient;
  }
}
