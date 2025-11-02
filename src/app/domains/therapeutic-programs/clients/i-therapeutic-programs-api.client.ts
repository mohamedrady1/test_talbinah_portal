import { Observable } from 'rxjs';
import { IMyTherapeuticProgramsResponseDto, IStoreProgrammeRequestDto, IStoreProgrammeResponseDto, ITherapeuticProgramItemResponseDto, ITherapeuticProgramsListingResponseDto } from '../dtos';
import { IPaginationParameters } from '../../../common';

export interface ITherapeuticProgramsApiClient {
  getAll: (paginationParameters?: IPaginationParameters) => Observable<ITherapeuticProgramsListingResponseDto>;
  getMyPrograms: (paginationParameters?: IPaginationParameters) => Observable<IMyTherapeuticProgramsResponseDto>;
  getTherapeuticProgramById: (id: number) => Observable<ITherapeuticProgramItemResponseDto>;

  storeProgramme(payload: IStoreProgrammeRequestDto): Observable<IStoreProgrammeResponseDto>;
}
