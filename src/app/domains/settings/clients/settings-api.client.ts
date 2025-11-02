import { CollectionApiClient, IPaginationParameters } from "../../../common";
import { ISettingsApiClient } from "./i-settings-api.client";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsManagementCollections } from "../collections";
import { ISettingMenuResponseDto, IVerifyNationalIdRequest, IVerifyNationalIdResponse, UpdateProfileRequestDto, UpdateProfileApiResponse, IGovernmentAgenciesResponseDto, IPointsResponseDto, IPointsGiftsResponseDto, IWalletPointsRecordsResponseDto, IServicePointsGiftsResponseDto, IWalletPointsToCouponRequestDto, IWalletPointsToCouponResponseDto, IDoctorTicketsResponseDto, IChangePasswordRequestDto, IChangePasswordResponseDto, ISendVerificationEmailResponse, ISendVerificationEmailRequest, IGovernmentAgenciesVerifyOtpResponseDto, IGovernmentAgenciesVerifyOtpRequestDto, IGovernmentAgencyDoctorsResponseDto, MovementsResponse, FaqsResponse, WalletResponse, ImportantNumbersResponse, IFaqsCategoriesResponseDto, IGiftReciverResponseDto, IGiftSenderResponseDto, IChargeWalletParamRequest, IChargeWalletResponseDto } from "../dtos";
import { IFavoriteDoctorsListingResponseDto } from "../dtos/responses/favorite-doctors-listing-response.dto";
import { ITicketCreateRequestDto } from '../dtos/requests';
import { IRewardsResponseDto, ITicketCreateResponseDto } from '../dtos/responses';
import { IGiftSendRequestDto } from '../dtos/requests';

@Injectable({ providedIn: 'root' })
export class SettingsApiClient implements ISettingsApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      SettingsManagementCollections.Settings,
      this.http
    );
  }

  getSettingsMenu(): Observable<ISettingMenuResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getSettingsMenu()
    });
  }

  getGovernmentAgencies(): Observable<IGovernmentAgenciesResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getGovernmentAgencies()
    });
  }
  sendGovernmentAgenciesEmailVerification(params: ISendVerificationEmailRequest): Observable<ISendVerificationEmailResponse> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.sendGovernmentAgenciesEmailVerification(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
  verifyGovernmentAgenciesEmailOtp(params: IGovernmentAgenciesVerifyOtpRequestDto): Observable<IGovernmentAgenciesVerifyOtpResponseDto> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.verifyGovernmentAgenciesEmailOtp(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }
  getGovernmentAgenciesDoctors(paginationParameters?: IPaginationParameters): Observable<IGovernmentAgencyDoctorsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getGovernmentAgenciesDoctors(),
      paginationParameters
    });
  }

  getFavoritesDoctors(paginationParameters?: IPaginationParameters): Observable<IFavoriteDoctorsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getFavoritesDoctors(),
      paginationParameters
    });
  }

  getPointsData(): Observable<IPointsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getPointsData()
    });
  }
  getPointsGifts(): Observable<IPointsGiftsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getPointsGifts()
    });
  }
  getWalletPointsRecords(): Observable<IWalletPointsRecordsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getWalletPointsRecords()
    });
  }
  chargeWallet(params: IChargeWalletParamRequest): Observable<IChargeWalletResponseDto> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.chargeWallet(),
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  getServicePointsGifts(): Observable<IServicePointsGiftsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getServicePointsGifts()
    });
  }

  getFetchRewards(): Observable<IRewardsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getFetchRewards()
    });
  }

  getWalletPointsToCoupon(body: IWalletPointsToCouponRequestDto): Observable<IWalletPointsToCouponResponseDto> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.walletPointsToCoupon(),
      body
    });
  }

  getDoctorTickets(): Observable<IDoctorTicketsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getDoctorTickets()
    });
  }
  getTickets(): Observable<any> {
    return this.collectionApiClient.get({
      collectionName: SettingsManagementCollections.getTickets()
    });
  }

  changeUserPassword(body: IChangePasswordRequestDto): Observable<IChangePasswordResponseDto> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.changeUserPassword(),
      body
    });
  }


  verifyNationalId(payload: IVerifyNationalIdRequest): Observable<IVerifyNationalIdResponse> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.verifyNationalId(),
      body: payload
    });
  }

  updateProfile(payload: UpdateProfileRequestDto): Observable<UpdateProfileApiResponse> {
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.updateProfile(),
      body: payload
    });
  }

  getMovements(): Observable<MovementsResponse> {
    return this.collectionApiClient.get<MovementsResponse, string>({
      collectionName: SettingsManagementCollections.Movements()
    });
  }

  getFaqs(categoryId: number): Observable<FaqsResponse> {
    return this.collectionApiClient.get<FaqsResponse, string>({
      collectionName: SettingsManagementCollections.Faqs(),
      requestOptions: {
        params: { id: categoryId.toString() }
      }
    });
  }

  getWallet(): Observable<WalletResponse> {
    return this.collectionApiClient.get<WalletResponse, string>({
      collectionName: SettingsManagementCollections.Wallet()
    });
  }

  getImportantNumbers(): Observable<ImportantNumbersResponse> {
    return this.collectionApiClient.get<ImportantNumbersResponse, string>({
      collectionName: SettingsManagementCollections.ImportantNumbers()
    });
  }

  getFaqsCategories(): Observable<IFaqsCategoriesResponseDto> {
    return this.collectionApiClient.get<IFaqsCategoriesResponseDto, string>({
      collectionName: SettingsManagementCollections.FaqsCategories()
    });
  }

  getSentGifts(): Observable<IGiftSenderResponseDto> {
    return this.collectionApiClient.get<IGiftSenderResponseDto, string>({
      collectionName: SettingsManagementCollections.getSentGifts()
    });
  }
  getReceivedGifts(): Observable<IGiftReciverResponseDto> {
    return this.collectionApiClient.get<IGiftReciverResponseDto, string>({
      collectionName: SettingsManagementCollections.getReceivedGifts()
    });
  }
  sendGift(payload: IGiftSendRequestDto): Observable<any> {
    return this.collectionApiClient.post<any, string, any>({
      collectionName: SettingsManagementCollections.sendGift(),
      body: payload
    });
  }
  acceptGift(gift_id: number): Observable<any> {
    return this.collectionApiClient.post<any, string, any>({
      collectionName: SettingsManagementCollections.acceptGift(),
      requestOptions: {
        params: { gift_id: gift_id.toString() }
      }
    });
  }
  cancelGift(gift_id: number): Observable<any> {
    return this.collectionApiClient.post<any, string, any>({
      collectionName: `${SettingsManagementCollections.cancelGift()}/${gift_id}`
    });
  }
  getDoctorTicketProblems(): Observable<{ status: boolean; message: string | null; data: { id: number; problem: string; }[] }> {
    return this.collectionApiClient.get<{ status: boolean; message: string | null; data: { id: number; problem: string; }[] }, string>({
      collectionName: SettingsManagementCollections.getDoctorTicketProblems()
    });
  }

  createTicket(payload: ITicketCreateRequestDto): Observable<ITicketCreateResponseDto> {
    const formData = new FormData();
    formData.append('problem_id', String(payload.problem_id));
    formData.append('description', payload.description);
    if (payload.images && payload.images.length) {
      payload.images.forEach((img: any) => {
        formData.append('images[]', img);
      });
    }
    return this.collectionApiClient.post({
      collectionName: SettingsManagementCollections.getTickets(),
      body: formData,
      requestOptions: {
        headers: { 'enctype': 'multipart/form-data' }
      }
    });
  }

  logout(): Observable<any> {
    return this.collectionApiClient.delete<any, any, any>({
      collectionName: SettingsManagementCollections.logout()
    });
  }
}
