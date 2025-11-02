export interface ISpecialityItemDto {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  is_report: number;
  active: number;
  original_active: string;
}

export interface ISpecialitiesResponseDto {
  status: boolean;
  message: string | null;
  data: ISpecialityItemDto[];
}


export interface IDurationItemDto {
  id: number;
  main_lang: string;
  translate_id: number | null;
  duration: number;
  price?: number;
  active: number;
  original_active: string;
  created_at: string;
}

export interface IDurationsResponseDto {
  status: boolean;
  message: string | null;
  data: IDurationItemDto[];
}

export interface ICommunicationItemDto {
  id: number;
  main_lang: string;
  translate_id: number | null;
  name: string;
  description: string;
  price: number;
  active: number;
  original_active: string;
  created_at: string;
}

export interface ICommunicationsResponseDto {
  status: boolean;
  message: string | null;
  data: ICommunicationItemDto[];
}
