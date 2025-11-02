import { ICitiesRequestDto, ICitiesResponseDto, ICountriesResponseDto } from "../dtos";
import { ILocationsApiClient } from "./i-locations-api.client";
import { CollectionApiClient } from "../../../../common";
import { HttpClient } from "@angular/common/http";
import { LocationsCollections } from "../collections";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationsApiClient implements ILocationsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      LocationsCollections.Lookups,
      http
    );
  }

  getCountries(): Observable<ICountriesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: LocationsCollections.Countries()
    });
  }

  getCities(payload: ICitiesRequestDto): Observable<ICitiesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: LocationsCollections.Cities(payload.countryCode)
    });
  }
}
