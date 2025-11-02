import { IAppointmentTypeSelectionsResponseDto, IDoctorsFitrationParametersResponseDto, IDoctorsListingResponseDto, IToggleFavoriteDoctorResponseDto } from '../dtos';
import { IApiResponse, IGlobalDoctorContactInfoModel, IPaginationParameters } from '../../../common';
import { Observable } from 'rxjs';

export interface IBookAppointmentApiClient {
  getAllDoctors: (paginationParameters?: IPaginationParameters) => Observable<IDoctorsListingResponseDto>;
  DoctorsFitrationParameters: (params?: any) => Observable<IDoctorsFitrationParametersResponseDto>;
  AppointmentTypeSelections: () => Observable<IAppointmentTypeSelectionsResponseDto>;
  getByDoctorId: (id: number) => Observable<IApiResponse<IGlobalDoctorContactInfoModel>>;
  ToggleFavoriteDoctor: (id: number, fav: boolean) => Observable<IToggleFavoriteDoctorResponseDto>;
}
