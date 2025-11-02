import { BookingInMemoryApiClient } from './booking-api.inmemory.client';
import { ApiClientProvider } from '../../../../common/core/data-access';
import { IBookingApiClient } from './i-booking-api.client';
import { BookingApiClient } from './booking-api.client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingApiClientProvider extends ApiClientProvider<IBookingApiClient> {
  constructor(
    private client: BookingApiClient,
    private inMemoryClient: BookingInMemoryApiClient
  ) {
    super();
  }

  protected override getInMemoryClient(): IBookingApiClient {
    return this.inMemoryClient;
  }
  protected override getApiClient(): IBookingApiClient {
    return this.client;
  }
}
