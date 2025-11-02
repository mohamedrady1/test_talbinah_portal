import { ICommunicationsResponseDto, IDurationParams, IDurationsResponseDto, ISpecialitiesResponseDto } from "../dtos";
import { IBookingApiClient } from "./i-booking-api.client";
import { CollectionApiClient } from "../../../../common";
import { HttpClient } from "@angular/common/http";
import { BookingCollections } from "../collections";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookingApiClient implements IBookingApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      BookingCollections.Lookups,
      http
    );
  }

  getSpecialities(): Observable<ISpecialitiesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookingCollections.Specialities()
    });
  }

  getDurations(doctor_id?: number, params?: any): Observable<IDurationsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookingCollections.Durations(doctor_id),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  getCommunications(): Observable<ICommunicationsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookingCollections.Communications()
    });
  }
}
