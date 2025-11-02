import { IBlockUserResponseDto, ICalcReservationCancelPriceResponseDto, ICalculateReservationPriceRequestDto, ICalculateReservationPriceResponseDto, ICancelReservationRequestDto, ICancelReservationResponseDto, ICheckPackagesReservationParamsDto, ICheckPackagesReservationResponseDto, IDoctorDaysLookupsResponseDto, IDoctorSlotsTimesResponseDto, ILeaveRatingRequestDto, ILeaveRatingResponseDto, IMeetingChatItem, INormalPackagesReservationRequestDto, INormalPackagesReservationResponseDto, IPaymentMethodsListingResponseDto, IReasonsCancelationListingResponseDto, IReasonsSchedulingLookupsResponseDto, IReservationChatResponseDto, IReservationHomeworkResponseDto, IReservationResponseDto, IReservationsListingResponseDto, IScheduleReservationRequestDto, IScheduleReservationResponseDto, IStoreNormalPackagesReservationRequestDto } from '../dtos';
import { IChatMessageDataDto, ISendMessageRequestDto } from '../../talbinah-bot';
import { IApiResponse, IPaginationParameters } from '../../../common';
import { Observable } from 'rxjs';
import { ICheckDoctorAtReservationResponseDto } from '../services';

export interface IAppointmentsApiClient {

  getPaymentMethods: () => Observable<IPaymentMethodsListingResponseDto>;
  calculateReservationPrice(payload: ICalculateReservationPriceRequestDto): Observable<ICalculateReservationPriceResponseDto>;


  getAllReservations: (paginationParameters?: IPaginationParameters) => Observable<IReservationsListingResponseDto>;
  getReservationById: (id: number) => Observable<IReservationResponseDto>;
  CheckDoctorAtReservation: (reservation_id: number | string) => Observable<ICheckDoctorAtReservationResponseDto>;

  CalcReservationCancelPrice: (id: number) => Observable<ICalcReservationCancelPriceResponseDto>;
  ReasonsCancelation: () => Observable<IReasonsCancelationListingResponseDto>;
  CancelReservationById: (id: number, payload: ICancelReservationRequestDto) => Observable<ICancelReservationResponseDto>;

  ReasonsScheduling: () => Observable<IReasonsSchedulingLookupsResponseDto>;
  DoctorDaysByIdDoctor: (id: number) => Observable<IDoctorDaysLookupsResponseDto>;
  GetDoctorSlotsTimes: (day_id: number, duration_id: number, doctor_id: number, date?: string) => Observable<IDoctorSlotsTimesResponseDto>;
  ScheduleReservationById: (id: number, payload: IScheduleReservationRequestDto) => Observable<IScheduleReservationResponseDto>;


  CheckPackagesReservation: (params: ICheckPackagesReservationParamsDto) => Observable<ICheckPackagesReservationResponseDto>;
  StoreNormalPackagesReservation: (payload: IStoreNormalPackagesReservationRequestDto) => Observable<INormalPackagesReservationResponseDto>;

  // getReservationChatByReservationId: (reservation_id: number) => Observable<IApiResponse<IReservationChatResponseDto[]>>;
  getReservationChatByReservationId: (reservation_id: number) => Observable<IApiResponse<IMeetingChatItem[]>>;

  GetReservationHomework(reservationId: number): Observable<IReservationHomeworkResponseDto>;
  ReviewHomework(assignmentId: number): Observable<IApiResponse<{ assignment_id: string }>>;
  BlockUserById(doctorId: number): Observable<IBlockUserResponseDto>;
  LeaveRatingById(id: number, payload: ILeaveRatingRequestDto): Observable<ILeaveRatingResponseDto>;


  sendMeetingMessage: (request: ISendMessageRequestDto) => Observable<IApiResponse<IChatMessageDataDto>>;
  uploadChatFiles: (reservationId: number, files: File[], isSupport?: boolean) => Observable<IApiResponse<string[] | null>>;
}
