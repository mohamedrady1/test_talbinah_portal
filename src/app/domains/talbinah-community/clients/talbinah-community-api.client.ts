import { ITalbinahCommunityApiClient } from "./i-talbinah-community-api.client";
import { TalbinahCommunityManagementCollections } from "../collections";
import { CollectionApiClient, IPaginationParameters, Logger } from "../../../common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IAllPostsResponseDto, ICommunityNotificationsResponseDto, ICreateCommentResponseDto, ICreatePostCommentRequestDto, ICreatePostRequestDto, ICreatePostResponseDto, IDeletePostRequestDto, IDeletePostResponseDto, IIdentityFormSubmissionRequestDto, IPostsInterestsListingResponseDto, IReactCommentResponseDto, IReactPostCommentRequestDto, IUpdateFollowRequestDto, IUpdateFollowResponseDto, IUpdatePostBookmarkRequestDto, IUpdatePostBookmarkResponseDto, IUpdatePostReactionRequestDto, IUpdatePostReactionResponseDto, IUpdatePostRequestDto, IUpdatePostResponseDto, IUpdateUserIdentifyProfileRequestDto, IUpdateUserIdentifyProfileResponseDto, IUserCommunityProfileResponseDto, IUserIdentifyProfileResponseDto, IUsersIFollowResponseDto } from "../dtos";
import { IEmoijsListingResponseDto } from "../dtos/responses/emoijs-interests-response.dto";

@Injectable({ providedIn: 'root' })
export class TalbinahCommunityApiClient implements ITalbinahCommunityApiClient {
  private readonly collectionApiClient: CollectionApiClient;

  constructor(private readonly http: HttpClient) {
    this.collectionApiClient = CollectionApiClient.create(
      TalbinahCommunityManagementCollections.TalbinahCommunity,
      this.http
    );
  }

  getAll(paginationParameters?: IPaginationParameters): Observable<IAllPostsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.TalbinahCommunityListing(),
      paginationParameters
    });
  }

  getPostInterests(): Observable<IPostsInterestsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.getPostInterests()
    });
  }

  getEmojis(): Observable<IEmoijsListingResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.getEmojis()
    });
  }

  updatePost(payload: IUpdatePostRequestDto, id: number): Observable<IUpdatePostResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.updatePost(id),
      body: payload
    });
  }
  createPost(payload: ICreatePostRequestDto): Observable<ICreatePostResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.createPost(),
      body: payload
    });
  }

  deletePost(id: number): Observable<IDeletePostResponseDto> {
    return this.collectionApiClient.delete({
      collectionName: TalbinahCommunityManagementCollections.deletePost(id)
    });
  }

  updatePostReaction(payload: IUpdatePostReactionRequestDto): Observable<IUpdatePostReactionResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.updatePostReaction(),
      body: payload
    });
  }
  updateFollowUser(payload: IUpdateFollowRequestDto): Observable<IUpdateFollowResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.updateFollowUser(),
      body: payload
    });
  }


  updateBookmarkReaction(payload: IUpdatePostBookmarkRequestDto): Observable<IUpdatePostBookmarkResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.updateBookmarkReaction(),
      body: payload
    });
  }

  createPostComment(id: number, payload: ICreatePostCommentRequestDto): Observable<ICreateCommentResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.createPostComment(id),
      body: payload
    });
  }
  reactPostComment(payload: IReactPostCommentRequestDto): Observable<IReactCommentResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.reactPostComment(),
      body: payload
    });
  }

  createIdentity(payload: IIdentityFormSubmissionRequestDto): Observable<IUserIdentifyProfileResponseDto> {
    Logger.debug('TalbinahCommunityApiClient | payload:', payload);
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.createIdentity(),
      body: payload
    });
  }

  updateIdentity(payload: IUpdateUserIdentifyProfileRequestDto): Observable<IUpdateUserIdentifyProfileResponseDto> {
    return this.collectionApiClient.post({
      collectionName: TalbinahCommunityManagementCollections.updateIdentity(),
      body: payload
    });
  }


  getUserIdentifyProfile(): Observable<IUserIdentifyProfileResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.getUserIdentifyProfile()
    });
  }

  getUserCommunityProfile(id: number, paginationParameters?: IPaginationParameters): Observable<IUserCommunityProfileResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.getUserCommunityProfile(id),
      paginationParameters
    });
  }

  TalbinahCommunityProfileUsersIFollow(paginationParameters?: IPaginationParameters): Observable<IUsersIFollowResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.TalbinahCommunityProfileUsersIFollow(),
      paginationParameters
    });
  }

  getTalbinahCommunity(params?: any): Observable<IAllPostsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.TalbinahCommunity,
      requestOptions: {
        params: {
          ...params
        }
      }
    });
  }

  TalbinahCommunityNotifications(paginationParameters?: IPaginationParameters): Observable<ICommunityNotificationsResponseDto> {
    return this.collectionApiClient.get({
      collectionName: TalbinahCommunityManagementCollections.TalbinahCommunityNotifications(),
      paginationParameters
    });
  }

}

// GET (with paginationParameters)
// this.collectionApiClient.get({
//   collectionName: 'TalbinahCommunity',
//   paginationParameters: queryParams
// });

// POST (with query params + body)

// this.collectionApiClient.post({
//   collectionName: 'TalbinahCommunity',
//   body,
//   paginationParameters: queryParams
// });

// PUT
// this.collectionApiClient.put({
//   collectionName: 'TalbinahCommunity',
//   id,
//   body,
//   paginationParameters: queryParams
// });

// DELETE
// this.collectionApiClient.delete({
//   collectionName: 'TalbinahCommunity',
//   id,
//   paginationParameters: queryParams
// });
