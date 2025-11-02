import { IPaginationParameters } from '../../../common';
import { ICreateMentalHealthScaleRequestDto, ICreateMentalHealthScaleResponseDto, ILastSevenUserMoodsResponseDto, IMentalHealthScalesListingResponseDto, IMoodsListingResponseDto, IMyMentalHealthScalesResponseDto, IStoreUserMoodRequestDto, IStoreUserMoodResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface IMentalHealthScalesApiClient {
  getMoods(): Observable<IMoodsListingResponseDto>;
  storeUserMood(payload: IStoreUserMoodRequestDto): Observable<IStoreUserMoodResponseDto>;
  lastSevenUserMood(): Observable<ILastSevenUserMoodsResponseDto>;

  getAll: (paginationParameters?: IPaginationParameters) => Observable<IMentalHealthScalesListingResponseDto>;
  CreateMentalHealthScale(payload: ICreateMentalHealthScaleRequestDto): Observable<ICreateMentalHealthScaleResponseDto>;
  MyMentalHealthScalesListing: (paginationParameters?: IPaginationParameters) => Observable<IMyMentalHealthScalesResponseDto>;
}
