import { ArticlesInMemoryApiClient } from './articles-api.inmemory.client';
import { IArticlesApiClient } from './i-articles-api.client';
import { ArticlesApiClient } from './articles-api.client';
import { ApiClientProvider } from '../../../common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ArticlesApiClientProvider extends ApiClientProvider<IArticlesApiClient> {
  constructor(
    private client: ArticlesApiClient,
    private inMemoryClient: ArticlesInMemoryApiClient
  ) {
    super();
  }

  protected override getApiClient(): IArticlesApiClient {
    return this.client;
  }

  protected override getInMemoryClient(): IArticlesApiClient {
    return this.inMemoryClient;
  }
}
