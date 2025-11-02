import { ISettingsApiClient } from './i-settings-api.client';
import { ISettingMenuResponseDto, IVerifyNationalIdRequest, IVerifyNationalIdResponse, UpdateProfileRequestDto, UpdateProfileApiResponse, IGovernmentAgenciesResponseDto, IPointsResponseDto, IPointsGiftsResponseDto, IWalletPointsRecordsResponseDto, IServicePointsGiftsResponseDto, IWalletPointsToCouponRequestDto, IWalletPointsToCouponResponseDto, IDoctorTicketsResponseDto, IChangePasswordRequestDto, IChangePasswordResponseDto, ISendVerificationEmailRequest, ISendVerificationEmailResponse, IGovernmentAgenciesVerifyOtpRequestDto, IGovernmentAgenciesVerifyOtpResponseDto, IGovernmentAgencyDoctorsResponseDto, MovementsResponse, FaqsResponse, IFaqsCategoriesResponseDto, WalletResponse, IChargeWalletParamRequest, IChargeWalletResponseDto, IRewardsResponseDto } from '../dtos';
import { Injectable } from '@angular/core';
import { mockChangePassword, mockDoctorTickets, mockFavoriteDoctorsListing, mockGovernmentAgencies, mockGovernmentAgenciesDoctors, mockGovernmentAgenciesEmailEmailOtp, mockGovernmentAgenciesEmailVerification, mockMovements, mockImportantNumbers, mockPoints, mockPointsGifts, mockServicePointsGifts, mockSettings, mockUpdateUserProfile, mockWalletPointsRecords, mockWalletPointsToCoupon, mockFaqs, mockFaqsCategories, mockWallet, mockSentGiftsResponse, mockReceivedGiftsResponse, mockTickets, mockChargeWallet, mockFetchRewards } from '../data';
import { Observable, of } from 'rxjs';
import { IPaginationParameters } from '../../../common';
import { IFavoriteDoctorsListingResponseDto } from '../dtos/responses/favorite-doctors-listing-response.dto';

import { ImportantNumbersResponse } from '../dtos/responses/important-numbers-response.dto';
@Injectable({ providedIn: 'root' })
export class SettingsInMemoryApiClient implements ISettingsApiClient {

  getSettingsMenu(): Observable<ISettingMenuResponseDto> {
    return of(mockSettings);
  }

  getGovernmentAgencies(): Observable<IGovernmentAgenciesResponseDto> {
    return of(mockGovernmentAgencies);
  }
  sendGovernmentAgenciesEmailVerification(params: ISendVerificationEmailRequest): Observable<ISendVerificationEmailResponse> {
    return of(mockGovernmentAgenciesEmailVerification);
  }
  verifyGovernmentAgenciesEmailOtp(params: IGovernmentAgenciesVerifyOtpRequestDto): Observable<IGovernmentAgenciesVerifyOtpResponseDto> {
    return of(mockGovernmentAgenciesEmailEmailOtp);
  }
  getGovernmentAgenciesDoctors(paginationParameters?: IPaginationParameters): Observable<IGovernmentAgencyDoctorsResponseDto> {
    return of(mockGovernmentAgenciesDoctors);
  }
  getFavoritesDoctors(paginationParameters?: IPaginationParameters): Observable<IFavoriteDoctorsListingResponseDto> {
    return of(mockFavoriteDoctorsListing);
  }


  getPointsData(): Observable<IPointsResponseDto> {
    return of(mockPoints);
  }
  getPointsGifts(): Observable<IPointsGiftsResponseDto> {
    return of(mockPointsGifts);
  }
  getWalletPointsRecords(): Observable<IWalletPointsRecordsResponseDto> {
    return of(mockWalletPointsRecords);
  }
  chargeWallet(params: IChargeWalletParamRequest): Observable<IChargeWalletResponseDto> {
    return of(mockChargeWallet);
  }

  getServicePointsGifts(): Observable<IServicePointsGiftsResponseDto> {
    return of(mockServicePointsGifts);
  }

  getFetchRewards(): Observable<IRewardsResponseDto> {
    return of(mockFetchRewards);
  }

  getWalletPointsToCoupon(body: IWalletPointsToCouponRequestDto): Observable<IWalletPointsToCouponResponseDto> {
    return of(mockWalletPointsToCoupon);
  }

  getDoctorTickets(): Observable<IDoctorTicketsResponseDto> {
    return of(mockDoctorTickets);
  }
  getTickets(): Observable<any> {
    return of(mockTickets);
  }

  changeUserPassword(body: IChangePasswordRequestDto): Observable<IChangePasswordResponseDto> {
    return of(mockChangePassword);
  }


  verifyNationalId(payload: IVerifyNationalIdRequest): Observable<IVerifyNationalIdResponse> {
    return of();
  }

  updateProfile(payload: UpdateProfileRequestDto): Observable<UpdateProfileApiResponse> {
    return of(mockUpdateUserProfile);
  }
  getMovements(): Observable<MovementsResponse> {
    return of(mockMovements);
  }

  getImportantNumbers(): Observable<ImportantNumbersResponse> {
    return of(mockImportantNumbers);
  }
  getFaqs(categoryId: number): Observable<FaqsResponse> {
    return of(mockFaqs);
  }

  getFaqsCategories(): Observable<IFaqsCategoriesResponseDto> {
    return of(mockFaqsCategories);
  }

  getWallet(): Observable<WalletResponse> {
    return of(mockWallet);
  }

  // GiftsFacade methods
  getSentGifts(): Observable<any> {
    return of(mockSentGiftsResponse);
  }
  getReceivedGifts(): Observable<any> {
    return of(mockReceivedGiftsResponse);
  }

  sendGift(payload: { phone: string; amount: number; country_id?: number; payment_id?: number }): Observable<any> {
    return of({ status: true, message: 'تم إرسال الهدية بنجاح', data: null });
  }

  acceptGift(gift_id: number): Observable<any> {
    return of({ status: true, message: 'تم قبول الهدية', data: null });
  }

  cancelGift(gift_id: number): Observable<any> {
    return of({ status: true, message: 'تم إلغاء الهدية', data: null });
  }

  getDoctorTicketProblems(): Observable<{ status: boolean; message: string | null; data: { id: number; problem: string; }[] }> {
    return of({
      status: true,
      message: null,
      data: [
        { id: 1, problem: 'مشكلة فى الجلسات' },
        { id: 2, problem: 'مشكلة فى الدفع' },
        { id: 3, problem: 'مشكلة تقنية' }
      ]
    });
  }

  createTicket(payload: any): Observable<any> {
    return of({ status: true, message: 'تم إنشاء التذكرة بنجاح', data: null });
  }

  logout(): Observable<any> {
    return of({ status: true, message: 'تم تسجيل الخروج بنجاح', data: null });
  }
}
