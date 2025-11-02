export class TalbinahCommunityManagementCollections {
  static ModuleName: string = 'api';

  static TalbinahCommunity: string = `${TalbinahCommunityManagementCollections.ModuleName}`;

  static TalbinahCommunityListing(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post`;
  }

  static getPostInterests(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/interest`;
  }

  static getEmojis(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/emojis`;
  }

  static createIdentity(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/user-profile/create`;
  }
  static updateIdentity(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/user-profile/update`;
  }

  static updatePostReaction(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post/like`;
  }

  static updateBookmarkReaction(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post/bookmark`;
  }

  static createPostComment(id: number): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post/comment/create`;
  }

  static reactPostComment(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post/comment/like`;
  }

  static createPost(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/post/create`;
  }
  static updatePost(id: number): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/post/${id}/update`;
  }
  static updateFollowUser(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/toggleUserFollow`;
  }

  static deletePost(id: number): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/post/${id}/delete`;
  }

  static getUserIdentifyProfile(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/user-profile`;
  }

  static TalbinahCommunityProfileUsersIFollow(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/usersIFollow`;
  }

  static getUserCommunityProfile(id: number): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/community/site/user-profile/view/${id}`;
  }

  static TalbinahCommunityNotifications(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/notifications/getCommunityNotifications`;
  }

  static FavoriteTalbinahCommunity(): string {
    return `${TalbinahCommunityManagementCollections.TalbinahCommunity}/site/favorites`;
  }
}
