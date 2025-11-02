import { IGlobalUserContactInfoModel } from "../../../../../common";

export interface ILoginResponseDto {
  status: boolean;
  message: string;
  data: {
    token?: string | null;
    user: IGlobalUserContactInfoModel | null;
    device_data: {
      ip: string | null;
      user_agent: string | null;
    };
  };
}

