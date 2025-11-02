import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { providerCenterServicesData } from '../data/customers.data';
import { ICustomersApiClient } from './i-customers-api.client';
import { IPaginationParameters, IPaginationResponse } from '../../../common/core/data-access';
import { ICreateCutomerResponse, ICustomerResponse, IUpsertCustomerRequest } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class CustomersInMemoryApiClient implements ICustomersApiClient {
  constructor(protected http: HttpClient) { }

  get(
    paginationParameters?: IPaginationParameters
  ): Observable<IPaginationResponse<ICustomerResponse>> {
    return of(providerCenterServicesData.providerCenterServicesResponse);
  }

  getById(id: string): Observable<ICustomerResponse> {
    return of(providerCenterServicesData.providerCenterServiceResponse);
  }

  create(
    request: IUpsertCustomerRequest
  ): Observable<ICreateCutomerResponse> {
    return of(providerCenterServicesData.createProviderCenterServiceResponse);
  }

  update(id: string, request: IUpsertCustomerRequest): Observable<void> {
    return of();
  }
}
