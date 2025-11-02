import { IGlobalDoctorContactInfoModel } from "../../../../common";

export interface IToggleFavoriteDoctorResponseDto {
  status: boolean;
  message: string | null;
  data: IGlobalDoctorContactInfoModel | null;
}
