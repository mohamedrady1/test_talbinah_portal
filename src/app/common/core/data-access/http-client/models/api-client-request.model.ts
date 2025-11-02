import { IPaginationParameters } from '../../pagination/interfaces/pagination-parameters.interface';
import { IRequestOptions } from './request-options.model';

export interface IApiClientOptions {
  collectionName?: string;
  collectionSegment?: string;
  resourceSegment?: string;
  requestOptions?: IRequestOptions;
  paginationParameters?: IPaginationParameters;
}

export interface IApiClientRequest<TId> extends IApiClientOptions {
  id?: TId;
}

export interface IBodiedApiClientRequest<TId, TBody> extends IApiClientRequest<TId> {
  body?: TBody;
}

/**
 * Generic API response wrapper.
 * @template T The type of the actual data payload in the response.
 */
export interface IApiResponse<T> {
  status: boolean;
  message: string | null;
  data: T | null;
}
