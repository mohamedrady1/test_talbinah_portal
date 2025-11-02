import { LocationsInMemoryApiClient } from './locations-api.inmemory.client';
import { ApiClientProvider } from '../../../../common/core/data-access';
import { ILocationsApiClient } from './i-locations-api.client';
import { LocationsApiClient } from './locations-api.client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationsApiClientProvider extends ApiClientProvider<ILocationsApiClient> {
  constructor(
    private client: LocationsApiClient,
    private inMemoryClient: LocationsInMemoryApiClient
  ) {
    super();
  }

  protected override getInMemoryClient(): ILocationsApiClient {
    return this.inMemoryClient;
  }
  protected override getApiClient(): ILocationsApiClient {
    return this.client;
  }
}
