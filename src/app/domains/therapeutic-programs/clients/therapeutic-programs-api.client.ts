import { ITherapeuticProgramsApiClient } from "./i-therapeutic-programs-api.client";
import { TherapeuticProgramsManagementCollections } from "../collections";
import { IMyTherapeuticProgramsResponseDto, IStoreProgrammeRequestDto, IStoreProgrammeResponseDto, ITherapeuticProgramItemResponseDto, ITherapeuticProgramsListingResponseDto } from "../dtos";
import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TherapeuticProgramsApiClient implements ITherapeuticProgramsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      TherapeuticProgramsManagementCollections.TherapeuticPrograms,
      this.http
    );
  }

  getAll(paginationParameters?: IPaginationParameters): Observable<ITherapeuticProgramsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TherapeuticProgramsManagementCollections.AllTherapeuticProgramsListing(),
      paginationParameters
    });
  }

  getMyPrograms(paginationParameters?: IPaginationParameters): Observable<IMyTherapeuticProgramsResponseDto> {
    return this.collectionApiClient.get({
      // collectionName: TherapeuticProgramsManagementCollections.AllTherapeuticProgramsListing(),
      collectionName: TherapeuticProgramsManagementCollections.getMyPrograms(),
      paginationParameters
    });
  }

  getTherapeuticProgramById(id: number): Observable<ITherapeuticProgramItemResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TherapeuticProgramsManagementCollections.getTherapeuticProgramById(id)
    });
  }

  storeProgramme(payload: IStoreProgrammeRequestDto): Observable<IStoreProgrammeResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TherapeuticProgramsManagementCollections.storeProgramme(),
      body: payload
    });
  }
}
