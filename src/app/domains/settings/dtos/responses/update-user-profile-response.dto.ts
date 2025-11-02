import { IGlobalUserContactInfoModel } from "../../../../common";

export interface UpdateProfileApiResponse {
  status: boolean;
  message?: string;
  data?: IGlobalUserContactInfoModel | null;
}
