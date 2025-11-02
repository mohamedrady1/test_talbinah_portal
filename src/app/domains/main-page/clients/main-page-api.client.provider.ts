import { MainPageInMemoryApiClient } from './main-page-api.inmemory.client';
import { IMainPageApiClient } from './i-main-page-api.client';
import { MainPageApiClient } from './main-page-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MainPageApiClientProvider extends ApiClientProvider<IMainPageApiClient> {
  constructor(
    private client: MainPageApiClient,
    private inMemoryClient: MainPageInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IMainPageApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IMainPageApiClient {
    return this.inMemoryClient;
  }
}
