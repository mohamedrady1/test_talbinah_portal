import { IPaginationParameters } from '../../../common';
import { IAllPostsResponseDto, ICommunityNotificationsResponseDto, ICreateCommentResponseDto, ICreatePostCommentRequestDto, ICreatePostRequestDto, ICreatePostResponseDto, IDeletePostRequestDto, IDeletePostResponseDto, IEmoijsListingResponseDto, IIdentityFormSubmissionRequestDto, IPostsInterestsListingResponseDto, IReactCommentResponseDto, IReactPostCommentRequestDto, IUpdateFollowRequestDto, IUpdateFollowResponseDto, IUpdatePostBookmarkRequestDto, IUpdatePostBookmarkResponseDto, IUpdatePostReactionRequestDto, IUpdatePostReactionResponseDto, IUpdatePostRequestDto, IUpdatePostResponseDto, IUpdateUserIdentifyProfileRequestDto, IUpdateUserIdentifyProfileResponseDto, IUserCommunityProfileResponseDto, IUserIdentifyProfileResponseDto, IUsersIFollowResponseDto } from '../dtos';
import { Observable } from 'rxjs';

export interface ITalbinahCommunityApiClient {
  getAll: (paginationParameters?: IPaginationParameters) => Observable<IAllPostsResponseDto>;
  getPostInterests(): Observable<IPostsInterestsListingResponseDto>;
  getEmojis(): Observable<IEmoijsListingResponseDto>;
  createIdentity(payload: IIdentityFormSubmissionRequestDto): Observable<IUserIdentifyProfileResponseDto>;
  updateIdentity(payload: IUpdateUserIdentifyProfileRequestDto): Observable<IUpdateUserIdentifyProfileResponseDto>;
  createPost(payload: ICreatePostRequestDto): Observable<ICreatePostResponseDto>;
  updatePost(payload: IUpdatePostRequestDto, id: number): Observable<IUpdatePostResponseDto>;
  deletePost(id: number): Observable<IDeletePostResponseDto>;

  updatePostReaction(payload: IUpdatePostReactionRequestDto): Observable<IUpdatePostReactionResponseDto>;
  updateFollowUser(payload: IUpdateFollowRequestDto): Observable<IUpdateFollowResponseDto>;
  updateBookmarkReaction(payload: IUpdatePostBookmarkRequestDto): Observable<IUpdatePostBookmarkResponseDto>;

  createPostComment(id: number, payload: ICreatePostCommentRequestDto): Observable<ICreateCommentResponseDto>;
  reactPostComment(payload: IReactPostCommentRequestDto): Observable<IReactCommentResponseDto>;

  getUserIdentifyProfile(): Observable<IUserIdentifyProfileResponseDto>;

  getUserCommunityProfile: (id: number, paginationParameters?: IPaginationParameters) => Observable<IUserCommunityProfileResponseDto>;
  TalbinahCommunityProfileUsersIFollow: (paginationParameters?: IPaginationParameters) => Observable<IUsersIFollowResponseDto>;

  getTalbinahCommunity: (params?: any) => Observable<IAllPostsResponseDto>;

  TalbinahCommunityNotifications: (paginationParameters?: IPaginationParameters) => Observable<ICommunityNotificationsResponseDto>;

}
