import { ITalbinahCommunityApiClient } from './i-talbinah-community-api.client';
import { IAllPostsResponseDto, ICommunityNotificationsResponseDto, ICreateCommentResponseDto, ICreatePostCommentRequestDto, ICreatePostRequestDto, ICreatePostResponseDto, IDeletePostRequestDto, IDeletePostResponseDto, IIdentityFormSubmissionRequestDto, IPostsInterestsListingResponseDto, IReactCommentResponseDto, IReactPostCommentRequestDto, IUpdateFollowRequestDto, IUpdateFollowResponseDto, IUpdatePostBookmarkRequestDto, IUpdatePostBookmarkResponseDto, IUpdatePostReactionRequestDto, IUpdatePostReactionResponseDto, IUpdatePostRequestDto, IUpdatePostResponseDto, IUpdateUserIdentifyProfileRequestDto, IUpdateUserIdentifyProfileResponseDto, IUserCommunityProfileResponseDto, IUserIdentifyProfileResponseDto, IUsersIFollowResponseDto } from '../dtos';
import { mockCreatePostCommentResponse, mockCreatePostResponse, mockEmojis, mockReactPostCommentResponse, mockTalbinahCommunity, mockTalbinahCommunityNotifications, mockTalbinahCommunityProfileUsersIFollow, mockTalbinahInterestsCommunity, mockUpdateFollowResponse, mockUpdatePostBookmarkResponse, mockUpdatePostReactionResponse, mockUserCommunityProfile, mockUserIdentifyProfile } from '../data';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPaginationParameters } from '../../../common';
import { IEmoijsListingResponseDto } from '../dtos/responses/emoijs-interests-response.dto';

@Injectable({ providedIn: 'root' })
export class TalbinahCommunityInMemoryApiClient implements ITalbinahCommunityApiClient {

  getAll(paginationParameters?: IPaginationParameters): Observable<IAllPostsResponseDto> {
    return of(mockTalbinahCommunity);
  }

  getPostInterests(): Observable<IPostsInterestsListingResponseDto> {
    return of(mockTalbinahInterestsCommunity);
  }

  getEmojis(): Observable<IEmoijsListingResponseDto> {
    return of(mockEmojis);
  }

  createIdentity(payload: IIdentityFormSubmissionRequestDto): Observable<IUserIdentifyProfileResponseDto> {
    return of();
  }
  updateIdentity(payload: IUpdateUserIdentifyProfileRequestDto): Observable<IUpdateUserIdentifyProfileResponseDto> {
    return of();
  }

  createPost(payload: ICreatePostRequestDto): Observable<ICreatePostResponseDto> {
    return of(mockCreatePostResponse);
  }
  updatePost(payload: IUpdatePostRequestDto, id: number): Observable<IUpdatePostResponseDto> {
    return of(mockCreatePostResponse);
  }

  deletePost(id: number): Observable<IDeletePostResponseDto> {
    return of();
  }

  updatePostReaction(payload: IUpdatePostReactionRequestDto): Observable<IUpdatePostReactionResponseDto> {
    return of(mockUpdatePostReactionResponse);
  }

  updateFollowUser(payload: IUpdateFollowRequestDto): Observable<IUpdateFollowResponseDto> {
    return of(mockUpdateFollowResponse);
  }

  updateBookmarkReaction(payload: IUpdatePostBookmarkRequestDto): Observable<IUpdatePostBookmarkResponseDto> {
    return of(mockUpdatePostBookmarkResponse);
  }

  createPostComment(id: number, payload: ICreatePostCommentRequestDto): Observable<ICreateCommentResponseDto> {
    return of(mockCreatePostCommentResponse);
  }
  reactPostComment(payload: IReactPostCommentRequestDto): Observable<IReactCommentResponseDto> {
    return of(mockReactPostCommentResponse);
  }

  getUserIdentifyProfile(): Observable<IUserIdentifyProfileResponseDto> {
    return of(mockUserIdentifyProfile);
  }

  getUserCommunityProfile(id: number): Observable<IUserCommunityProfileResponseDto> {
    return of(mockUserCommunityProfile);
  }

  TalbinahCommunityProfileUsersIFollow(paginationParameters?: IPaginationParameters): Observable<IUsersIFollowResponseDto> {
    return of(mockTalbinahCommunityProfileUsersIFollow);
  }

  getTalbinahCommunity(): Observable<IAllPostsResponseDto> {
    return of(mockTalbinahCommunity);
  }

  TalbinahCommunityNotifications(paginationParameters?: IPaginationParameters): Observable<ICommunityNotificationsResponseDto> {
    return of(mockTalbinahCommunityNotifications);
  }
}
