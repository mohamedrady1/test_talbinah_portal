import { IUser } from "../../../authentication";

export interface IVerifyNationalIdResponse {
  status: boolean;
  message?: string;
  data?: IUser | null;
}
