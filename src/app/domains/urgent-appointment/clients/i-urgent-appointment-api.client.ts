import { ICancelEmergencyAppointmentRequestDto, ICancelEmergencyAppointmentResponseDto, ICheckEmergencyAppointmentReservationResponseDto, ICheckReservationEmergencyParamsDto, IEmergencyDurationsPriceRequestParamsDto, IEmergencyDurationsPriceResponseDto, IStoreEmergencyAppointmentRequestDto, IStoreEmergencyAppointmentResponseDto, IEmergencySpecialtiesResponseDto, IUrgentAppointmentResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface IUrgentAppointmentApiClient {
  getEmergencyDurationsPrice: (params: IEmergencyDurationsPriceRequestParamsDto) => Observable<IEmergencyDurationsPriceResponseDto>;
  getEmergencySpecialties: () => Observable<IEmergencySpecialtiesResponseDto>;
  storeEmergencyAppointment(payload: IStoreEmergencyAppointmentRequestDto): Observable<IStoreEmergencyAppointmentResponseDto>;
  checkEmergencyAppointmentReservation(params: ICheckReservationEmergencyParamsDto): Observable<ICheckEmergencyAppointmentReservationResponseDto>;
  cancelEmergencyAppointment(payload: ICancelEmergencyAppointmentRequestDto, id: number): Observable<ICancelEmergencyAppointmentResponseDto>;
}
