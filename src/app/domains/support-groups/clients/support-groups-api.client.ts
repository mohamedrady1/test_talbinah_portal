import { SupportGroupsManagementCollections } from "../collections";
import { ISupportGroupsApiClient } from "./i-support-groups-api.client";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IMySeminarsResponseDto, ISeminarItemResponseDto, ISeminarsListingResponseDto, IStoreSeminarRequestDto, IStoreSeminarResponseDto } from "../dtos";

@Injectable({ providedIn: 'root' })
export class SupportGroupsApiClient implements ISupportGroupsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      SupportGroupsManagementCollections.Seminars,
      this.http
    );
  }

  // get(paginationParameters?: IPaginationParameters): Observable<IPaginationResponse<IArticlesListingResponseDto>> {
  getAll(paginationParameters?: IPaginationParameters): Observable<ISeminarsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SupportGroupsManagementCollections.SeminarsListing(),
      paginationParameters
    });
  }

  MySeminarsListing(paginationParameters?: IPaginationParameters): Observable<IMySeminarsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SupportGroupsManagementCollections.MySeminarsListing(),
      // collectionName: SupportGroupsManagementCollections.getMyPrograms(),
      paginationParameters
    });
  }

  getSeminarById(id: number): Observable<ISeminarItemResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SupportGroupsManagementCollections.getSeminarById(id)
    });
  }

  storeSeminar(payload: IStoreSeminarRequestDto): Observable<IStoreSeminarResponseDto> {
    return this.collectionApiClient.post({
      collectionName: SupportGroupsManagementCollections.storeSeminar(),
      body: payload
    });
  }
}
