import { Observable } from 'rxjs';
import { ISettingMenuResponseDto, IVerifyNationalIdRequest, IVerifyNationalIdResponse, UpdateProfileRequestDto, UpdateProfileApiResponse, IGovernmentAgenciesResponseDto, IPointsResponseDto, IPointsGiftsResponseDto, IWalletPointsRecordsResponseDto, IServicePointsGiftsResponseDto, IWalletPointsToCouponResponseDto, IWalletPointsToCouponRequestDto, IDoctorTicketsResponseDto, IChangePasswordResponseDto, IChangePasswordRequestDto, ISendVerificationEmailResponse, ISendVerificationEmailRequest, IGovernmentAgenciesVerifyOtpResponseDto, IGovernmentAgenciesVerifyOtpRequestDto, IGovernmentAgencyDoctorsResponseDto, IFavoriteDoctorsListingResponseDto, MovementsResponse, IFaqsCategoriesResponseDto, FaqsResponse, ImportantNumbersResponse, WalletResponse, IChargeWalletParamRequest, IChargeWalletResponseDto, ITicketCreateRequestDto, ITicketCreateResponseDto, IGiftSendRequestDto, IRewardsResponseDto } from '../dtos';
import { IPaginationParameters } from '../../../common';

export interface ISettingsApiClient {
  // get: ( paginationParameters?: IPaginationParameters) => Observable<IPaginationResponse<IArticlesListingResponseDto>>;
  getSettingsMenu: () => Observable<ISettingMenuResponseDto>;

  getGovernmentAgencies: () => Observable<IGovernmentAgenciesResponseDto>;
  sendGovernmentAgenciesEmailVerification: (params: ISendVerificationEmailRequest) => Observable<ISendVerificationEmailResponse>;
  verifyGovernmentAgenciesEmailOtp: (params: IGovernmentAgenciesVerifyOtpRequestDto) => Observable<IGovernmentAgenciesVerifyOtpResponseDto>;
  getGovernmentAgenciesDoctors: (paginationParameters?: IPaginationParameters) => Observable<IGovernmentAgencyDoctorsResponseDto>;

  getPointsData: () => Observable<IPointsResponseDto>;
  getPointsGifts: () => Observable<IPointsGiftsResponseDto>;
  getWalletPointsRecords: () => Observable<IWalletPointsRecordsResponseDto>;
  getServicePointsGifts: () => Observable<IServicePointsGiftsResponseDto>;
  getWalletPointsToCoupon: (body: IWalletPointsToCouponRequestDto) => Observable<IWalletPointsToCouponResponseDto>;
  getFetchRewards: () => Observable<IRewardsResponseDto>;
  chargeWallet: (params: IChargeWalletParamRequest) => Observable<IChargeWalletResponseDto>;


  getFavoritesDoctors: (paginationParameters?: IPaginationParameters) => Observable<IFavoriteDoctorsListingResponseDto>;

  getDoctorTickets: () => Observable<IDoctorTicketsResponseDto>;
  getTickets: () => Observable<any>;
  changeUserPassword: (body: IChangePasswordRequestDto) => Observable<IChangePasswordResponseDto>;
  createTicket(payload: ITicketCreateRequestDto): Observable<ITicketCreateResponseDto>;

  verifyNationalId(payload: IVerifyNationalIdRequest): Observable<IVerifyNationalIdResponse>;
  updateProfile(payload: UpdateProfileRequestDto): Observable<UpdateProfileApiResponse>;

  getMovements(): Observable<MovementsResponse>;

  getFaqsCategories(): Observable<IFaqsCategoriesResponseDto>;
  getFaqs(categoryId: number): Observable<FaqsResponse>;

  getImportantNumbers(): Observable<ImportantNumbersResponse>;

  getWallet(): Observable<WalletResponse>;

  getSentGifts(): Observable<any>;
  getReceivedGifts(): Observable<any>;
  sendGift(payload: IGiftSendRequestDto): Observable<any>;
  acceptGift(gift_id: number): Observable<any>;
  cancelGift(gift_id: number): Observable<any>;
  getDoctorTicketProblems: () => Observable<{ status: boolean; message: string | null; data: { id: number; problem: string; }[] }>;

  logout(): Observable<any>;
}
