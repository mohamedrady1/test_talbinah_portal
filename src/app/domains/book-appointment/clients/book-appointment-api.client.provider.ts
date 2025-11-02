import { BookAppointmentInMemoryApiClient } from './book-appointment-api.inmemory.client';
import { IBookAppointmentApiClient } from './i-book-appointment-api.client';
import { BookAppointmentApiClient } from './book-appointment-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookAppointmentApiClientProvider extends ApiClientProvider<IBookAppointmentApiClient> {
  constructor(
    private client: BookAppointmentApiClient,
    private inMemoryClient: BookAppointmentInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IBookAppointmentApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IBookAppointmentApiClient {
    return this.inMemoryClient;
  }
}
