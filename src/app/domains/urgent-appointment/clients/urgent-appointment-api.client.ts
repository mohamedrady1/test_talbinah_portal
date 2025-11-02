import { IUrgentAppointmentApiClient } from "./i-urgent-appointment-api.client";
import { UrgentAppointmentManagementCollections } from "../collections";
import { CollectionApiClient } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICancelEmergencyAppointmentRequestDto, ICancelEmergencyAppointmentResponseDto, ICheckEmergencyAppointmentReservationResponseDto, ICheckReservationEmergencyParamsDto, IEmergencyDurationsPriceRequestParamsDto, IEmergencyDurationsPriceResponseDto, IStoreEmergencyAppointmentRequestDto, IStoreEmergencyAppointmentResponseDto, IEmergencySpecialtiesResponseDto, IUrgentAppointmentResponseDto } from "../dtos";

@Injectable({ providedIn: 'root' })
export class UrgentAppointmentApiClient implements IUrgentAppointmentApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      UrgentAppointmentManagementCollections.UrgentAppointment,
      this.http
    );
  }

  getEmergencyDurationsPrice(params: IEmergencyDurationsPriceRequestParamsDto): Observable<IEmergencyDurationsPriceResponseDto> {
    return this.collectionApiClient.get({
      collectionName: UrgentAppointmentManagementCollections.getEmergencyDurationsPrice(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  getEmergencySpecialties(): Observable<IEmergencySpecialtiesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: UrgentAppointmentManagementCollections.getEmergencySpecialties()
    });
  }

  storeEmergencyAppointment(payload: IStoreEmergencyAppointmentRequestDto): Observable<IStoreEmergencyAppointmentResponseDto> {
    return this.collectionApiClient.post({
      collectionName: UrgentAppointmentManagementCollections.storeEmergencyAppointment(),
      body: payload
    });
  }

  checkEmergencyAppointmentReservation(params: ICheckReservationEmergencyParamsDto): Observable<ICheckEmergencyAppointmentReservationResponseDto> {
    return this.collectionApiClient.get({
      collectionName: UrgentAppointmentManagementCollections.checkEmergencyAppointmentReservation(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  cancelEmergencyAppointment(payload: ICancelEmergencyAppointmentRequestDto, id: number): Observable<ICancelEmergencyAppointmentResponseDto> {
    return this.collectionApiClient.put({
      collectionName: UrgentAppointmentManagementCollections.cancelEmergencyAppointment(id),
      body: payload
    });
  }

}
