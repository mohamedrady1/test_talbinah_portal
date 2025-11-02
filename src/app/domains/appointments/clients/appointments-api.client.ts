import { CollectionApiClient, IApiResponse, IPaginationParameters } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IAppointmentsApiClient } from "./i-appointments-api.client";
import { AppointmentsManagementCollections } from "../collections";
import { IBlockUserResponseDto, ICalcReservationCancelPriceResponseDto, ICalculateReservationPriceRequestDto, ICalculateReservationPriceResponseDto, ICancelReservationRequestDto, ICancelReservationResponseDto, ICheckPackagesReservationParamsDto, ICheckPackagesReservationResponseDto, IDoctorDaysLookupsResponseDto, IDoctorSlotsTimesResponseDto, ILeaveRatingRequestDto, ILeaveRatingResponseDto, IMeetingChatItem, INormalPackagesReservationRequestDto, INormalPackagesReservationResponseDto, IPaymentMethodsListingResponseDto, IReasonsCancelationListingResponseDto, IReasonsSchedulingLookupsResponseDto, IReservationChatResponseDto, IReservationHomeworkResponseDto, IReservationResponseDto, IReservationsListingResponseDto, IScheduleReservationRequestDto, IScheduleReservationResponseDto, IStoreNormalPackagesReservationRequestDto } from "../dtos";
import { IChatMessageDataDto, ISendMessageRequestDto } from "../../talbinah-bot";
import { ICheckDoctorAtReservationResponseDto } from "../services";

@Injectable({ providedIn: 'root' })
export class AppointmentsApiClient implements IAppointmentsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      AppointmentsManagementCollections.Reservations,
      this.http
    );
  }

  getPaymentMethods(): Observable<IPaymentMethodsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.PaymentMethods()
    });
  }
  calculateReservationPrice(payload: ICalculateReservationPriceRequestDto): Observable<ICalculateReservationPriceResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.calculateReservationPrice(),
      body: payload
    });
  }


  getAllReservations(paginationParameters?: IPaginationParameters): Observable<IReservationsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.ReservationsListing(),
      paginationParameters
    });
  }

  getReservationById(id: number): Observable<IReservationResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.GetReservationById(id)
    });
  }

  ReasonsCancelation(): Observable<IReasonsCancelationListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.ReasonsCancelation()
    });
  }
  CalcReservationCancelPrice(id: number): Observable<ICalcReservationCancelPriceResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.CalcReservationCancelPrice(id),
      body: {} // Sending an empty object as body as per curl implied no specific payload
    });
  }
  CancelReservationById(id: number, payload: ICancelReservationRequestDto): Observable<ICancelReservationResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.CancelReservationById(id),
      body: payload
    });
  }

  ReasonsScheduling(): Observable<IReasonsSchedulingLookupsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.ReasonsScheduling()
    });
  }
  DoctorDaysByIdDoctor(id: number): Observable<IDoctorDaysLookupsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.DoctorDaysByIdDoctor(id)
    });
  }
  GetDoctorSlotsTimes(
    day_id: number,
    duration_id: number,
    doctor_id: number,
    date?: string
  ): Observable<IDoctorSlotsTimesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.GetDoctorSlotsTimes(day_id, duration_id, doctor_id),
      requestOptions: {
        params: date !== undefined ? { date } : {}
      }
    });
  }

  ScheduleReservationById(id: number, payload: IScheduleReservationRequestDto): Observable<IScheduleReservationResponseDto> {
    return this.collectionApiClient.put({
      collectionName: AppointmentsManagementCollections.ScheduleReservationById(id),
      body: payload
    });
  }

  CheckPackagesReservation(params: ICheckPackagesReservationParamsDto): Observable<ICheckPackagesReservationResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.CheckPackagesReservation(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
  StoreNormalPackagesReservation(payload: IStoreNormalPackagesReservationRequestDto): Observable<INormalPackagesReservationResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.StoreNormalPackagesReservation(),
      body: payload
    });
  }

  // getReservationChatByReservationId(reservation_id: number): Observable<IApiResponse<IReservationChatResponseDto[]>> {
  //   return this.collectionApiClient.get({
  //     collectionName: AppointmentsManagementCollections.getReservationChatByReservationId(reservation_id)
  //   });
  // }

  getReservationChatByReservationId(reservation_id: number): Observable<IApiResponse<IMeetingChatItem[]>> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.getReservationChatByReservationId(reservation_id)
    });
  }
  CheckDoctorAtReservation(reservation_id: number | string): Observable<ICheckDoctorAtReservationResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.CheckDoctorAtReservation(reservation_id)
    });
  }

  GetReservationHomework(id: number): Observable<IReservationHomeworkResponseDto> {
    return this.collectionApiClient.get({
      collectionName: AppointmentsManagementCollections.GetReservationHomework(id)
    });
  }
  ReviewHomework(assignmentId: number): Observable<IApiResponse<{ assignment_id: string }>> {
    return this.collectionApiClient.put({
      collectionName: AppointmentsManagementCollections.ReviewHomework(),
      requestOptions: { params: { assignment_id: assignmentId } }
    });
  }
  BlockUserById(doctorId: number): Observable<IBlockUserResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.BlockUserById(),
      requestOptions: {
        params: {
          doctor_id: doctorId
        }
      }
    });
  }
  LeaveRatingById(id: number, payload: ILeaveRatingRequestDto): Observable<ILeaveRatingResponseDto> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.LeaveRatingById(id),
      requestOptions: {
        params: {
          ...payload
        }
      }
    });
  }

  sendMeetingMessage(request: ISendMessageRequestDto): Observable<IApiResponse<IChatMessageDataDto>> {
    return this.collectionApiClient.post({
      collectionName: AppointmentsManagementCollections.SendMeetingMessage(),
      body: request
    });
  }

  uploadChatFiles(reservationId: number, files: File[], isSupport?: boolean): Observable<IApiResponse<string[] | null>> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('files[]', file, file.name); // 'files[]' is the expected field name for multiple files
    });
    if (isSupport) {
      return this.collectionApiClient.post({
        collectionName: AppointmentsManagementCollections.StoreSupportChatFiles(reservationId),
        body: formData
      });
    } else {
      return this.collectionApiClient.post({
        collectionName: AppointmentsManagementCollections.StoreChatFiles(reservationId),
        body: formData
      });
    }
  }
}
