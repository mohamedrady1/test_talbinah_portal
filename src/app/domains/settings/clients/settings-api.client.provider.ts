import { ISettingsApiClient } from './i-settings-api.client';
import { SettingsApiClient } from './settings-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';
import { SettingsInMemoryApiClient } from './settings-api.inmemory.client';

@Injectable({ providedIn: 'root' })
export class SettingsApiClientProvider extends ApiClientProvider<ISettingsApiClient> {
  constructor(
    private client: SettingsApiClient,
    private inMemoryClient: SettingsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ISettingsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ISettingsApiClient {
    return this.inMemoryClient;
  }
}
