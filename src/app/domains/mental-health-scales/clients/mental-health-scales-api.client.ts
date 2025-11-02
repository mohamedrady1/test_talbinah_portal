import { MentalHealthScalesManagementCollections } from "../collections";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICreateMentalHealthScaleRequestDto, ICreateMentalHealthScaleResponseDto, ILastSevenUserMoodsResponseDto, IMentalHealthScalesListingResponseDto, IMoodsListingResponseDto, IMyMentalHealthScalesResponseDto, IStoreUserMoodRequestDto, IStoreUserMoodResponseDto } from "../dtos";
import { IMentalHealthScalesApiClient } from "./i-mental-health-scales-api.client";

@Injectable({ providedIn: 'root' })
export class MentalHealthScalesApiClient implements IMentalHealthScalesApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      MentalHealthScalesManagementCollections.MentalHealthScales,
      this.http
    );
  }

  getMoods(): Observable<IMoodsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MentalHealthScalesManagementCollections.getMoods()
    });
  }

  storeUserMood(payload: IStoreUserMoodRequestDto): Observable<IStoreUserMoodResponseDto> {
    return this.collectionApiClient.post({
      collectionName: MentalHealthScalesManagementCollections.storeUserMood(),
      body: payload
    });
  }

  lastSevenUserMood(): Observable<ILastSevenUserMoodsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MentalHealthScalesManagementCollections.lastSevenUserMood()
    });
  }

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<IMentalHealthScalesListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MentalHealthScalesManagementCollections.MentalHealthScalesListing(),
      paginationParameters
    });
  }

  CreateMentalHealthScale(payload: ICreateMentalHealthScaleRequestDto): Observable<ICreateMentalHealthScaleResponseDto> {
    return this.collectionApiClient.post({
      collectionName: MentalHealthScalesManagementCollections.CreateMentalHealthScale(),
      body: payload
    });
  }

  MyMentalHealthScalesListing(paginationParameters?: IPaginationParameters): Observable<IMyMentalHealthScalesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: MentalHealthScalesManagementCollections.MyMentalHealthScalesListing(),
      paginationParameters
    });
  }
}

// GET (with paginationParameters)
// this.collectionApiClient.get({
//   collectionName: 'MentalHealthScales',
//   paginationParameters: queryParams
// });

// POST (with query params + body)

// this.collectionApiClient.post({
//   collectionName: 'MentalHealthScales',
//   body,
//   paginationParameters: queryParams
// });

// PUT
// this.collectionApiClient.put({
//   collectionName: 'MentalHealthScales',
//   id,
//   body,
//   paginationParameters: queryParams
// });

// DELETE
// this.collectionApiClient.delete({
//   collectionName: 'MentalHealthScales',
//   id,
//   paginationParameters: queryParams
// });
