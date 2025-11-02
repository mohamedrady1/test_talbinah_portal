import { BaseApiClient } from './base-api-client.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiClientOptionsUtils } from '../utils/api-client-options.utils';
import { IBodiedApiClientRequest, IApiClientRequest } from '../models/api-client-request.model';
import { environment } from '../../../../../../assets';
import { Logger } from '../../../utilities';

export class CollectionApiClient {
  public baseApiClient: BaseApiClient;

  private constructor(
    private collectionName: string,
    httpClient: HttpClient
  ) {
    this.baseApiClient = BaseApiClient.create(httpClient, environment.apiUrl);
  }

  static create(collectionName: string, httpClient: HttpClient): CollectionApiClient {
    return new CollectionApiClient(collectionName, httpClient);
  }

  post<TBody, TResponse, TId>(request: IBodiedApiClientRequest<TId, TBody>): Observable<TResponse> {
    return this.baseApiClient.post<TResponse>(
      this.getResourceUrl(request),
      request.body,
      ApiClientOptionsUtils.getRequestOptions(request)
    );
  }

  get<TResponse, TId>(request?: IApiClientRequest<TId>): Observable<TResponse> {
    // Logger.debug('CollectionApiClient: ', request);
    return this.baseApiClient.get<TResponse>(
      this.getResourceUrl(request),
      ApiClientOptionsUtils.getRequestOptions(request)
    );
  }

  put<TBody, TResponse, TId>(request: IBodiedApiClientRequest<TId, TBody>): Observable<TResponse> {
    return this.baseApiClient.put<TResponse>(
      this.getResourceUrl(request),
      request.body,
      ApiClientOptionsUtils.getRequestOptions(request)
    );
  }

  patch<TBody, TResponse, TId>(request: IBodiedApiClientRequest<TId, TBody>): Observable<TResponse> {
    return this.baseApiClient.patch<TResponse>(
      this.getResourceUrl(request),
      request.body,
      ApiClientOptionsUtils.getRequestOptions(request)
    );
  }

  delete<TBody, TResponse, TId>(request: IBodiedApiClientRequest<TId, TBody>): Observable<TResponse> {
    return this.baseApiClient.delete<TResponse>(
      this.getResourceUrl(request),
      request.body,
      ApiClientOptionsUtils.getRequestOptions(request)
    );
  }

  public getResourceUrl<TId>(request?: IApiClientRequest<TId>) {
    let collectionUrl = ApiClientOptionsUtils.getCollectionUrl(this.collectionName, request);
    return request?.id
      ? `${collectionUrl}/${ApiClientOptionsUtils.getResourceUrl(request.id, request)}`
      : collectionUrl;
  }
}
