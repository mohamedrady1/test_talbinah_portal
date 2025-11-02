import { IGlobalDoctorContactInfoModel } from "../../../../common";

export interface IGovernmentAgencyDoctorsResponseDto {
  status: boolean;
  message?: string | null;
  data?: IGlobalDoctorContactInfoModel[] | null;
}
