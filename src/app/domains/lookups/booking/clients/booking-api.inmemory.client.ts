import { ICommunicationsResponseDto, IDurationsResponseDto, ISpecialitiesResponseDto } from '../dtos';
import { IBookingApiClient } from './i-booking-api.client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockCommunicationsResponseData, mockDurationsResponseData, mockSpecialitiesResponseData } from '../data';

@Injectable({
  providedIn: 'root'
})
export class BookingInMemoryApiClient implements IBookingApiClient {
  constructor(protected http: HttpClient) { }

  getSpecialities(): Observable<ISpecialitiesResponseDto> {
    return of(mockSpecialitiesResponseData);
  }

  getDurations(doctor_id?: number, params?: any): Observable<IDurationsResponseDto> {
    return of(mockDurationsResponseData);
  }

  getCommunications(): Observable<ICommunicationsResponseDto> {
    return of(mockCommunicationsResponseData);
  }
}
