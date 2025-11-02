import { IPost } from "./talbinah-community-response.dto";
import { IUserIdentifyProfileData } from "./user-identify-profile-response.dto";

/**
 * The top-level response DTO for all posts.
 */
export interface IUserCommunityProfileResponseDto {
  status: boolean;
  message: string | null;
  data: {
    me: boolean,
    is_followd?: boolean | number,
    profileData: IUserIdentifyProfileData,
    posts: IPost[]
  };
}
