import { IGlobalDoctorContactInfoModel } from "../../../../common";

export interface IFavoriteDoctorsListingResponseDto {
  data: data;
  message: string | null;
  status: boolean;
}

export interface data {
  data: IGlobalDoctorContactInfoModel[] | null;
}