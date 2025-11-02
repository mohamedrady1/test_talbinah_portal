export interface IDoctorsFitrationParametersResponseDto {
  status: boolean;
  message: string | null;
  data: IDoctorsFitrationParameters;
}

export interface IDoctorsFitrationParameters {
  specialties: IKeyedFilterParameter<ISpecialtyParameter>;
  min_price: IKeyedValueParameter<number>;
  max_price: IKeyedValueParameter<number>;
  languages: IKeyedFilterParameter<ILanguageParameter>;
  services: IKeyedFilterParameter<IServiceParameter>;
  gender: IKeyedFilterParameter<IGenderParameter>;
}

export interface IKeyedFilterParameter<T> {
  key: string;
  data: T[];
}

export interface IKeyedValueParameter<T> {
  key: string;
  data: T;
}

export interface ISpecialtyParameter {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  is_report: number;
  active: number;
  original_active: string;
}

export interface ILanguageParameter {
  id: number;
  title: string;
}

export interface IServiceParameter {
  id: number;
  title: string;
}

export type IGenderParameter = { male: 'male' } | { female: 'female' };
