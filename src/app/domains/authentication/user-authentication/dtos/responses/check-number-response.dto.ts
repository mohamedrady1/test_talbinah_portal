import { IUser } from "../../models";

export interface ICheckNumberResponseDto {
  status: boolean;
  message: string;
  data: ICheckNumberData;
}

export interface ICheckNumberData {
  user: boolean | IUser | null;
  validated?: string | boolean;
  otp_verified?: boolean | null
}
