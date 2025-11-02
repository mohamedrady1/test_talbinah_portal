import { IUser } from "../../models";

export interface IResetPasswordResponseDto {
  status: boolean;
  message: string;
  data: {
    token: string;
    user: IUser | null;
  };
}
