import { IUrgentAppointmentApiClient } from './i-urgent-appointment-api.client';
import { ICancelEmergencyAppointmentRequestDto, ICancelEmergencyAppointmentResponseDto, ICheckEmergencyAppointmentReservationResponseDto, ICheckReservationEmergencyParamsDto, IEmergencyDurationsPriceRequestParamsDto, IEmergencyDurationsPriceResponseDto, IStoreEmergencyAppointmentRequestDto, IStoreEmergencyAppointmentResponseDto, IEmergencySpecialtiesResponseDto, IUrgentAppointmentResponseDto } from '../dtos';
import { mockCancelEmergencyAppointment, mockEmergencyAppointmentReservation, mockEmergencyDurationsPrice, mockStoreEmergencyAppointment } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UrgentAppointmentInMemoryApiClient implements IUrgentAppointmentApiClient {

  getEmergencyDurationsPrice(params: IEmergencyDurationsPriceRequestParamsDto): Observable<IEmergencyDurationsPriceResponseDto> {
    return of(mockEmergencyDurationsPrice);
  }

  getEmergencySpecialties(): Observable<IEmergencySpecialtiesResponseDto> {
    return of({
      status: true,
      message: null,
      data: [
        {
          id: 1,
          name: 'طبيب نفسي',
          description: 'وصف طبيب نفسي',
          original_active: null,
          image: {
            id: 11,
            url: 'https://talbinahprod.s3.eu-central-1.amazonaws.com/specialties-images/JAjviULnGIvkv2hKjYkabA5123RcTXOHsR5KO8i5.png',
            imageable_id: 1,
            imageable_type: 'Modules\\Specialty\\Entities\\Specialty',
            created_at: '2023-09-06T22:25:16.000000Z',
            updated_at: '2024-03-21T19:27:17.000000Z'
          }
        },
        {
          id: 2,
          name: 'أخصائي نفسي',
          description: 'وصف أخصائي نفسي',
          original_active: null,
          image: {
            id: 12,
            url: 'https://talbinahprod.s3.eu-central-1.amazonaws.com/specialties-images/mt866VhJm6XwhMvROgIg3Mb7tNH6XgxmQpJ5zNVR.png',
            imageable_id: 2,
            imageable_type: 'Modules\\Specialty\\Entities\\Specialty',
            created_at: '2023-09-06T22:25:30.000000Z',
            updated_at: '2024-03-21T19:27:52.000000Z'
          }
        },
        {
          id: 12,
          name: 'لايف كوتش',
          description: 'مدرب شخصي',
          original_active: null,
          image: {
            id: 574,
            url: 'https://talbinahprod.s3.eu-central-1.amazonaws.com/specialties-images/UweFAQZt9yfnqFdhbUjTx96DGNYASp5IWW6o9lJK.png',
            imageable_id: 12,
            imageable_type: 'Modules\\Specialty\\Entities\\Specialty',
            created_at: '2025-07-27T12:48:27.000000Z',
            updated_at: '2025-07-27T12:48:27.000000Z'
          }
        }
      ]
    });
  }

  storeEmergencyAppointment(payload: IStoreEmergencyAppointmentRequestDto): Observable<IStoreEmergencyAppointmentResponseDto> {
    return of(mockStoreEmergencyAppointment);
  }

  checkEmergencyAppointmentReservation(params: ICheckReservationEmergencyParamsDto): Observable<ICheckEmergencyAppointmentReservationResponseDto> {
    return of(mockEmergencyAppointmentReservation);
  }

  cancelEmergencyAppointment(payload: ICancelEmergencyAppointmentRequestDto, id: number): Observable<ICancelEmergencyAppointmentResponseDto> {
    return of(mockCancelEmergencyAppointment);
  }
}
