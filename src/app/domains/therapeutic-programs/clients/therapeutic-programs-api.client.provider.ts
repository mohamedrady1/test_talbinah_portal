import { TherapeuticProgramsInMemoryApiClient } from './therapeutic-programs-api.inmemory.client';
import { ITherapeuticProgramsApiClient } from './i-therapeutic-programs-api.client';
import { TherapeuticProgramsApiClient } from './therapeutic-programs-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TherapeuticProgramsApiClientProvider extends ApiClientProvider<ITherapeuticProgramsApiClient> {
  constructor(
    private client: TherapeuticProgramsApiClient,
    private inMemoryClient: TherapeuticProgramsInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): ITherapeuticProgramsApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): ITherapeuticProgramsApiClient {
    return this.inMemoryClient;
  }
}
