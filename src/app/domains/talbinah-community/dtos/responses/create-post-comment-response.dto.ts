import { IPost } from "./talbinah-community-response.dto";

export interface ICreateCommentResponseDto {
  status: boolean;
  message: string;
  data: {
    post: IPost;
  };
}
