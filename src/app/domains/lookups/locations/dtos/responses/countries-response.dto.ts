export interface ICountryDto {
  id: number;
  name: string;
  flag: string;
  code: string;
  code2: string | null;
  numcode: string | null;
  phone_code: string;

  // Optional fields (not present in the provided response)
  main_lang?: string;
  active?: number;
  original_active?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  translate_id?: number | null;
}

export interface ICountriesResponseDto {
  status: boolean;
  message: string | null;
  data: ICountryDto[];
}
