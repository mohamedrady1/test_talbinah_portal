export interface Emoji {
  id: number;
  image: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface IUserIFollow {
  id: number;
  name: string | null;
  image: Emoji | null;
}

export interface IUsersIFollowResponseDto {
  status: boolean;
  message: string | null;
  data: IUserIFollow[];
}
