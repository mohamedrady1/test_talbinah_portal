import { IPaymentsListingResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface IPaymentsApiClient {
  getPaymentsListing: (params?: any) => Observable<IPaymentsListingResponseDto>;
}
