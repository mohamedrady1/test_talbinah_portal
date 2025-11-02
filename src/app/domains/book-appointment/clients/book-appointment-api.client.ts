import { IAppointmentTypeSelectionsResponseDto, IDoctorsFitrationParametersResponseDto, IDoctorsListingResponseDto, IToggleFavoriteDoctorResponseDto } from "../dtos";
import { CollectionApiClient, IApiResponse, IGlobalDoctorContactInfoModel, IPaginationParameters } from "../../../common";
import { IBookAppointmentApiClient } from "./i-book-appointment-api.client";
import { BookAppointmentManagementCollections } from "../collections";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BookAppointmentApiClient implements IBookAppointmentApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      BookAppointmentManagementCollections.Doctors,
      this.http
    );
  }

  getAllDoctors(paginationParameters?: IPaginationParameters): Observable<IDoctorsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookAppointmentManagementCollections.DoctorsListing(),
      paginationParameters
    });
  }
  DoctorsFitrationParameters(params?: any): Observable<IDoctorsFitrationParametersResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookAppointmentManagementCollections.DoctorsFitrationParameters(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
  AppointmentTypeSelections(): Observable<IAppointmentTypeSelectionsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: BookAppointmentManagementCollections.AppointmentTypeSelections()
    });
  }
  getByDoctorId(id: number): Observable<IApiResponse<IGlobalDoctorContactInfoModel>> {
    return this.collectionApiClient.get({
      collectionName: BookAppointmentManagementCollections.GetDoctorById(id)
    });
  }
  ToggleFavoriteDoctor(id: number, fav: boolean): Observable<IToggleFavoriteDoctorResponseDto> {
    return this.collectionApiClient.post({
      collectionName: BookAppointmentManagementCollections.ToggleFavoriteDoctor(id, fav),
      requestOptions: {
        params: {
          doctor_id: id
        }
      }
    });
  }
}
