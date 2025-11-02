import { Observable } from 'rxjs';
import { ICitiesRequestDto, ICitiesResponseDto, ICountriesResponseDto } from '../dtos';

export interface ILocationsApiClient {
  getCountries(): Observable<ICountriesResponseDto>;
  getCities(payload: ICitiesRequestDto): Observable<ICitiesResponseDto>;
}
