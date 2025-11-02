import { ISupportGroupsApiClient } from './i-support-groups-api.client';
import { IMySeminarsResponseDto, ISeminarItemResponseDto, ISeminarsListingResponseDto, IStoreSeminarRequestDto, IStoreSeminarResponseDto } from '../dtos';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPaginationParameters } from '../../../common';
import { mockMySeminarsListing, mockSeminarItem, mockSeminarsListing, mockStoreSeminar } from '../data';

@Injectable({ providedIn: 'root' })
export class SupportGroupsInMemoryApiClient implements ISupportGroupsApiClient {

  getAll(paginationParameters?: IPaginationParameters): Observable<ISeminarsListingResponseDto> {
    return of(mockSeminarsListing);
  }

  MySeminarsListing(paginationParameters?: IPaginationParameters): Observable<IMySeminarsResponseDto> {
    return of(mockMySeminarsListing);
  }

  getSeminarById(id: number): Observable<ISeminarItemResponseDto> {
    return of(mockSeminarItem);
  }

  storeSeminar(payload: IStoreSeminarRequestDto): Observable<IStoreSeminarResponseDto> {
    return of(mockStoreSeminar);
  }
}
