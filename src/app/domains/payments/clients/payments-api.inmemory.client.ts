import { IPaymentsApiClient } from './i-payments-api.client';
import { IPaymentsListingResponseDto } from '../dtos';
import { mockPayments } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentsInMemoryApiClient implements IPaymentsApiClient {

  getPaymentsListing(): Observable<IPaymentsListingResponseDto> {
    return of(mockPayments); // ← New combined method
  }
}
