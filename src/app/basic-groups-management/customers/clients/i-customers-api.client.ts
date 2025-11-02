import { Observable } from 'rxjs';
import {
  IUpsertCustomerRequest,
  ICreateCutomerResponse,
  ICustomerResponse
} from '../dtos';
import { IPaginationParameters, IPaginationResponse } from '../../../common/core/data-access';

export interface ICustomersApiClient {
  get: (
    paginationParameters?: IPaginationParameters
  ) => Observable<IPaginationResponse<ICustomerResponse>>;

  getById: (id: string) => Observable<ICustomerResponse>;
  create: (request: IUpsertCustomerRequest) => Observable<ICreateCutomerResponse>;
  update: (id: string, request: IUpsertCustomerRequest) => Observable<void>;
}
