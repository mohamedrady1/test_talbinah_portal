import { ICitiesRequestDto, ICitiesResponseDto, ICountriesResponseDto } from '../dtos';
import { ILocationsApiClient } from './i-locations-api.client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockICountriesResponseData, mockLocationsData } from '../data';

@Injectable({
  providedIn: 'root'
})
export class LocationsInMemoryApiClient implements ILocationsApiClient {
  constructor(protected http: HttpClient) { }

  getCountries(): Observable<ICountriesResponseDto> {
    return of(mockICountriesResponseData);
  }


  getCities(payload: ICitiesRequestDto): Observable<ICitiesResponseDto> {
    return of(mockLocationsData.citiesResponse);
  }
}
