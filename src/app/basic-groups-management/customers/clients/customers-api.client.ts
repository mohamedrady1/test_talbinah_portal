import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomersApiClient } from './i-customers-api.client';
import { CollectionApiClient, IPaginationParameters, IPaginationResponse } from '../../../common/core/data-access';
import { BasicGroupsManagementCollections } from '../../common';
import { ICreateCutomerResponse, ICustomerResponse, IUpsertCustomerRequest } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class CustomersApiClient implements ICustomersApiClient {
  private collectionApiClient: CollectionApiClient;

  constructor(protected http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      BasicGroupsManagementCollections.Departments,
      http
    );
  }

  get(
    paginationParameters?: IPaginationParameters
  ): Observable<IPaginationResponse<ICustomerResponse>> {
    return this.collectionApiClient.get({
      collectionName: BasicGroupsManagementCollections.Departments,
      paginationParameters
    });
  }

  getById(id: string): Observable<ICustomerResponse> {
    return this.collectionApiClient.get({
      collectionName: BasicGroupsManagementCollections.Departments,
      id
    });
  }

  create(
    request: IUpsertCustomerRequest
  ): Observable<ICreateCutomerResponse> {
    return this.collectionApiClient.post({
      collectionName: BasicGroupsManagementCollections.Departments,
      body: request
    });
  }

  update(id: string, request: IUpsertCustomerRequest): Observable<void> {
    return this.collectionApiClient.put({
      collectionName: BasicGroupsManagementCollections.Departments,
      id,
      body: request
    });
  }
}
