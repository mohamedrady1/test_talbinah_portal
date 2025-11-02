import { IBlockUserResponseDto, ICalcReservationCancelPriceResponseDto, ICalculateReservationPriceRequestDto, ICalculateReservationPriceResponseDto, ICancelReservationRequestDto, ICancelReservationResponseDto, ICheckPackagesReservationParamsDto, ICheckPackagesReservationResponseDto, IDoctorDaysLookupsResponseDto, IDoctorSlotsTimesResponseDto, ILeaveRatingRequestDto, ILeaveRatingResponseDto, IMeetingChatItem, INormalPackagesReservationRequestDto, INormalPackagesReservationResponseDto, IPaymentMethodsListingResponseDto, IReasonsCancelationListingResponseDto, IReasonsSchedulingLookupsResponseDto, IReservationChatResponseDto, IReservationHomeworkResponseDto, IReservationResponseDto, IReservationsListingResponseDto, IScheduleReservationRequestDto, IScheduleReservationResponseDto, IStoreNormalPackagesReservationRequestDto } from '../dtos';
import { mockBlockUser, mockCalcPriceCnacelReservationItem, mockCheckDoctorAtReservation, mockCheckPackagesReservation, mockCnacelReservationItem, mockDoctorDays, mockDoctorSlotsTimes, mockLeaveRating, mockNormalPackagesReservation, mockPaymentsListing, mockReasonsCancelation, mockReasonsScheduling, mockReservationChatItem, mockReservationHomework, mockReservationItem, mockReservationMeetingChatItem, mockReservationPrice, mockReservationsListing, mockscheduleReservationItem, mockUploadChatFiles, mockReviewHomework } from '../data';
import { IChatMessageDataDto, ISendMessageRequestDto } from '../../talbinah-bot';
import { IApiResponse, IPaginationParameters } from '../../../common';
import { IAppointmentsApiClient } from './i-appointments-api.client';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICheckDoctorAtReservationResponseDto } from '../services';

@Injectable({ providedIn: 'root' })
export class AppointmentsListingInMemoryApiClient implements IAppointmentsApiClient {

  getPaymentMethods(): Observable<IPaymentMethodsListingResponseDto> {
    return of(mockPaymentsListing);
  }
  calculateReservationPrice(payload: ICalculateReservationPriceRequestDto): Observable<ICalculateReservationPriceResponseDto> {
    return of(mockReservationPrice);
  }

  getAllReservations(paginationParameters?: IPaginationParameters): Observable<IReservationsListingResponseDto> {
    return of(mockReservationsListing);
  }

  getReservationById(id: number): Observable<IReservationResponseDto> {
    return of(mockReservationItem);
  }


  CalcReservationCancelPrice(id: number): Observable<ICalcReservationCancelPriceResponseDto> {
    return of(mockCalcPriceCnacelReservationItem);
  }
  ReasonsCancelation(): Observable<IReasonsCancelationListingResponseDto> {
    return of(mockReasonsCancelation);
  }
  CancelReservationById(id: number, payload: ICancelReservationRequestDto): Observable<ICancelReservationResponseDto> {
    return of(mockCnacelReservationItem);
  }

  ReasonsScheduling(): Observable<IReasonsSchedulingLookupsResponseDto> {
    return of(mockReasonsScheduling);
  }
  DoctorDaysByIdDoctor(id: number): Observable<IDoctorDaysLookupsResponseDto> {
    return of(mockDoctorDays);
  }
  GetDoctorSlotsTimes(day_id: number, duration_id: number, doctor_id: number, date?: string): Observable<IDoctorSlotsTimesResponseDto> {
    return of(mockDoctorSlotsTimes);
  }
  ScheduleReservationById(id: number, payload: IScheduleReservationRequestDto): Observable<IScheduleReservationResponseDto> {
    return of(mockscheduleReservationItem);
  }


  CheckPackagesReservation(params: ICheckPackagesReservationParamsDto): Observable<ICheckPackagesReservationResponseDto> {
    return of(mockCheckPackagesReservation);
  }
  StoreNormalPackagesReservation(payload: IStoreNormalPackagesReservationRequestDto): Observable<INormalPackagesReservationResponseDto> {
    return of(mockNormalPackagesReservation);
  }

  // getReservationChatByReservationId(id: number): Observable<IApiResponse<IReservationChatResponseDto[]>> {
  //   return of(mockReservationChatItem);
  // }
  getReservationChatByReservationId(id: number): Observable<IApiResponse<IMeetingChatItem[]>> {
    return of(mockReservationMeetingChatItem);
  }
  CheckDoctorAtReservation(reservation_id: number | string): Observable<ICheckDoctorAtReservationResponseDto> {
    return of(mockCheckDoctorAtReservation);
  }

  sendMeetingMessage(request: ISendMessageRequestDto): Observable<IApiResponse<IChatMessageDataDto>> {
    return of();
  }

  GetReservationHomework(id: number): Observable<IReservationHomeworkResponseDto> {
    return of(mockReservationHomework);
  }
  BlockUserById(doctorId: number): Observable<IBlockUserResponseDto> {
    return of(mockBlockUser);
  }
  LeaveRatingById(id: number, payload: ILeaveRatingRequestDto): Observable<ILeaveRatingResponseDto> {
    return of(mockLeaveRating);
  }
  uploadChatFiles(reservationId: number, files: File[]): Observable<IApiResponse<string[] | null>> {
    return of(mockUploadChatFiles);
  }
  ReviewHomework(assignmentId: number): Observable<IApiResponse<{ assignment_id: string }>> {
    return of(mockReviewHomework);
  }
}
