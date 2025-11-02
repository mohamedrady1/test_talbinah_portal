import { Injectable } from '@angular/core';
import { ApiClientProvider } from '../../../../common/core/data-access';
import { IUserAuthenticationApiClient } from './i-user-authentication-api.client';
import { UserAuthenticationApiClient } from './user-authentication-api.client';
import { UserAuthenticationInMemoryApiClient } from './user-authentication-api.inmemory.client';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationApiClientProvider extends ApiClientProvider<IUserAuthenticationApiClient> {
  constructor(
    private client: UserAuthenticationApiClient,
    private inMemoryClient: UserAuthenticationInMemoryApiClient
  ) {
    super();
  }

  protected override getInMemoryClient(): IUserAuthenticationApiClient {
    return this.inMemoryClient;
  }
  protected override getApiClient(): IUserAuthenticationApiClient {
    return this.client;
  }
}
