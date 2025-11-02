export interface ICheckPackagesReservationResponseDto {
  message: string | null;
  status: boolean;
  data: ICheckPackagesReservationData | null;
}

export interface ICheckPackagesReservationData {
  packages: IReservationPackageModel[];
  has_package: number;
}

export interface IReservationPackageModel {
  id: number;
  price: number;
  number_of_reservations: number;
  usage_number: number;
  max_reservation_price: number | null;
  package_period: number;
  type: string;
  discount: number;
  active: number;
  reservations_count: number;
  durations: IPackageDurationModel;
  url: string | null;
}

export interface IPackageDurationModel {
  id: number;
  main_lang: string;
  translate_id: number | null;
  duration: number;
  active: number;
  original_active: string;
  created_at: string; // ISO 8601
}
