import { IGlobalUserContactInfoModel } from "../../../../common";

export interface IPreferredMsgChannelResponseDto {
  status: boolean;
  message: string | null;
  data: IGlobalUserContactInfoModel | null;
}
