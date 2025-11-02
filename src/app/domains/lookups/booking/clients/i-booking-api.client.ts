import { Observable } from 'rxjs';
import { ICommunicationsResponseDto, IDurationsResponseDto, ISpecialitiesResponseDto } from '../dtos';

export interface IBookingApiClient {
  getSpecialities(): Observable<ISpecialitiesResponseDto>;
  getDurations(doctor_id?: number, params?: any): Observable<IDurationsResponseDto>;
  getCommunications(): Observable<ICommunicationsResponseDto>;
}
