import { IGlobalDoctorContactInfoModel } from "../../../../common";
import { IDoctor } from "../../models";

export interface INextAvailability {
  id: number;
  doctor_id: number;
  day_id: number;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface ISpecialist {
  id: number;
  name: string;
  image: string;
}

export interface IDoctorsListingResponseDto {
  status: boolean;
  message: null | string;
  data: {
    data: IGlobalDoctorContactInfoModel[];
    links: {
      first: string;
      last: string;
      prev: null | string;
      next: null | string;
    };
    meta: IMetaDto;
  };
}

export interface IMetaDto {
  current_page: number;
  from: number;
  last_page: number;
  links: ILinkDto[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}
export interface ILinkDto {
  url: null | string;
  label: string;
  active: boolean;
}

