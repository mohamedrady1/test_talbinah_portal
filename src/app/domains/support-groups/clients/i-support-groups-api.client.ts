import { IPaginationParameters } from '../../../common';
import { IMySeminarsResponseDto, ISeminarItemResponseDto, ISeminarsListingResponseDto, IStoreSeminarRequestDto, IStoreSeminarResponseDto, ISupportGroupsListingResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface ISupportGroupsApiClient {
  getAll: (paginationParameters?: IPaginationParameters) => Observable<ISeminarsListingResponseDto>;
  MySeminarsListing: (paginationParameters?: IPaginationParameters) => Observable<IMySeminarsResponseDto>;

  getSeminarById: (id: number) => Observable<ISeminarItemResponseDto>;

  storeSeminar(payload: IStoreSeminarRequestDto): Observable<IStoreSeminarResponseDto>;
}
