import { ICreateMentalHealthScaleRequestDto, ICreateMentalHealthScaleResponseDto, ILastSevenUserMoodsResponseDto, IMentalHealthScalesListingResponseDto, IMoodsListingResponseDto, IMyMentalHealthScalesResponseDto, IStoreUserMoodRequestDto, IStoreUserMoodResponseDto } from '../dtos';
import { mockCreateMentalHealthScale, mockLastSeven, mockMentalHealthScalesListing, mockMoodsListing, mockMyMentalHealthScales, mockStoreMood } from '../data';
import { IMentalHealthScalesApiClient } from './i-mental-health-scales-api.client';
import { IPaginationParameters } from '../../../common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MentalHealthScalesInMemoryApiClient implements IMentalHealthScalesApiClient {
  getMoods(): Observable<IMoodsListingResponseDto> {
    return of(mockMoodsListing);
  }
  storeUserMood(payload: IStoreUserMoodRequestDto): Observable<IStoreUserMoodResponseDto> {
    return of(mockStoreMood);
  }
  lastSevenUserMood(): Observable<ILastSevenUserMoodsResponseDto> {
    return of(mockLastSeven);
  }

  getAll(paginationParameters?: IPaginationParameters): Observable<IMentalHealthScalesListingResponseDto> {
    return of(mockMentalHealthScalesListing);
  }
  CreateMentalHealthScale(payload: ICreateMentalHealthScaleRequestDto): Observable<ICreateMentalHealthScaleResponseDto> {
    return of(mockCreateMentalHealthScale);
  }
  MyMentalHealthScalesListing(paginationParameters?: IPaginationParameters): Observable<IMyMentalHealthScalesResponseDto> {
    return of(mockMyMentalHealthScales);
  }
}
