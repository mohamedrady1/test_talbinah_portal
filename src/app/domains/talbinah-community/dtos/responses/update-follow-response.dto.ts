import { IPost } from "./talbinah-community-response.dto";

export interface IUpdateFollowResponseDto {
  status: boolean;
  message: string;
  data: {
    user_id: number;
    is_followed: boolean;
    post?: IPost;
  }
}
