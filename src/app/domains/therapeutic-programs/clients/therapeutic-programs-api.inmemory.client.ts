import { ITherapeuticProgramsApiClient } from './i-therapeutic-programs-api.client';
import { IMyTherapeuticProgramsResponseDto, IStoreProgrammeRequestDto, IStoreProgrammeResponseDto, ITherapeuticProgramItemResponseDto, ITherapeuticProgramsListingResponseDto } from '../dtos';
import { mockMyTherapeuticPrograms, mockstoreProgramme, mockTherapeuticProgramItem, mockTherapeuticProgramsListing } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPaginationParameters } from '../../../common';

@Injectable({ providedIn: 'root' })
export class TherapeuticProgramsInMemoryApiClient implements ITherapeuticProgramsApiClient {

  getAll(paginationParameters?: IPaginationParameters): Observable<ITherapeuticProgramsListingResponseDto> {
    return of(mockTherapeuticProgramsListing);
  }

  getMyPrograms(paginationParameters?: IPaginationParameters): Observable<IMyTherapeuticProgramsResponseDto> {
    return of(mockMyTherapeuticPrograms);
  }
  getTherapeuticProgramById(id: number): Observable<ITherapeuticProgramItemResponseDto> {
    return of(mockTherapeuticProgramItem);
  }

  storeProgramme(payload: IStoreProgrammeRequestDto): Observable<IStoreProgrammeResponseDto> {
    return of(mockstoreProgramme);
  }
}
