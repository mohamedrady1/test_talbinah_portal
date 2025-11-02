import { IApiResponse, IGlobalDoctorContactInfoModel, IPaginationParameters } from '../../../common';
import { IAppointmentTypeSelectionsResponseDto, IDoctorsFitrationParametersResponseDto, IDoctorsListingResponseDto, IToggleFavoriteDoctorResponseDto } from '../dtos';
import { mockAppointmentTypeSelections, mockDoctorItem, mockDoctorList, mockFitrationParameters, mockToggleFavoriteDoctor } from '../data';
import { IBookAppointmentApiClient } from './i-book-appointment-api.client';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookAppointmentInMemoryApiClient implements IBookAppointmentApiClient {

  getAllDoctors(paginationParameters?: IPaginationParameters): Observable<IDoctorsListingResponseDto> {
    return of(mockDoctorList);
  }
  DoctorsFitrationParameters(): Observable<IDoctorsFitrationParametersResponseDto> {
    return of(mockFitrationParameters);
  }

  getByDoctorId(id: number): Observable<IApiResponse<IGlobalDoctorContactInfoModel>> {
    return of(mockDoctorItem);
  }
  ToggleFavoriteDoctor(id: number, fav: boolean): Observable<IToggleFavoriteDoctorResponseDto> {
    return of(mockToggleFavoriteDoctor);
  }
  AppointmentTypeSelections(): Observable<IAppointmentTypeSelectionsResponseDto> {
    return of(mockAppointmentTypeSelections);
  }
}
