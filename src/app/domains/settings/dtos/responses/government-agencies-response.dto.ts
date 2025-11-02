export interface IGovernmentAgencyItemdDto {
  id: number;
  name: string;
  image: string;
  domain: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface IGovernmentAgenciesResponseDto {
  status: boolean;
  message: string | null;
  data: IGovernmentAgencyItemdDto[];
}
