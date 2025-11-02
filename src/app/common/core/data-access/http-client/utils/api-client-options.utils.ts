import { httpUtils } from './http.utilis';
import { IApiClientOptions } from '../models/api-client-request.model';
import { IRequestOptions } from '../models/request-options.model';
import { HttpParams } from '@angular/common/http';

export class ApiClientOptionsUtils {
  static getCollectionUrl(defaultCollectionName: string, options?: IApiClientOptions): string {
    let collectionName = options?.collectionName ?? defaultCollectionName;

    if (options?.collectionSegment) {
      return `${collectionName}/${options.collectionSegment}`;
    }

    return collectionName;
  }

  static getResourceUrl<TId>(id: TId, options?: IApiClientOptions) {
    if (options?.resourceSegment) {
      return `${id}/${options.resourceSegment}`;
    }
    return id;
  }

  static getRequestOptions(options?: IApiClientOptions): IRequestOptions {
    const requestOptions: IRequestOptions = options?.requestOptions ?? {};
    const paginationParameters = options?.paginationParameters ?? {};

    // Convert both to Record<string, any> first
    const existingParams = requestOptions.params ?? {};
    const mergedParams: Record<string, any> = {
      ...(existingParams instanceof HttpParams ? {} : existingParams),
      ...paginationParameters
    };

    requestOptions.params = httpUtils.createHttpParams(mergedParams);

    return requestOptions;
  }
}
