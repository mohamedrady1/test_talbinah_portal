/**
 * Represents a single interest item within the user's identity profile.
 */
export interface IUserIdentifyProfileInterest {
  id: number;
  name: string; // was previously `user`
  image: string;
  created_at: string; // ISO 8601
}

/**
 * Represents the main data structure of the user's identity profile.
 */
export interface IUserIdentifyProfileData {
  id: number;
  dummy_name: string;
  gender?: number;
  emoji: {
    id: number;
    image: string | null;
    label: string | null;
    created_at: string;
    updated_at: string;
  };

  interests: IUserIdentifyProfileInterest[];

  my_post_count: number;
  my_following_count: number;
  my_followers_count: number;

  created_at: string;
}

/**
 * Represents the full API response for fetching the user's identity profile.
 */
export interface IUserIdentifyProfileResponseDto {
  status: boolean;
  message: string | null;
  data: IUserIdentifyProfileData | null; // Can be null if no profile is found
}

export interface IUpdateUserIdentifyProfileResponseDto {
  status: boolean;
  message: string | null;
  data: IUserIdentifyProfileData | null; // Can be null if no profile is found
}
