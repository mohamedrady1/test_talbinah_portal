import { PaymentsManagementCollections } from "../collections";
import { IPaymentsApiClient } from "./i-payments-api.client";
import { CollectionApiClient } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IPaymentsListingResponseDto } from "../dtos";

@Injectable({ providedIn: 'root' })
export class PaymentsApiClient implements IPaymentsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      PaymentsManagementCollections.Payments,
      this.http
    );
  }

  queryParams = { page: 2, size: 10, sort: 'desc' };
  body = { name: 'Podcast 1' };
  id = 'abc123';

  getPaymentsListing(params?: any): Observable<IPaymentsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: PaymentsManagementCollections.Payments,
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
}

// GET (with paginationParameters)
// this.collectionApiClient.get({
//   collectionName: 'Payments',
//   paginationParameters: queryParams
// });

// POST (with query params + body)

// this.collectionApiClient.post({
//   collectionName: 'Payments',
//   body,
//   paginationParameters: queryParams
// });

// PUT
// this.collectionApiClient.put({
//   collectionName: 'Payments',
//   id,
//   body,
//   paginationParameters: queryParams
// });

// DELETE
// this.collectionApiClient.delete({
//   collectionName: 'Payments',
//   id,
//   paginationParameters: queryParams
// });
