export interface IPointsServiceDto {
  id: number | null;
  service_key: string | null;
  service_name: string | null;
  description: string;
  points: number | string;
  expiration_date: number;
  status: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface IPointsResponseDto {
  status: boolean;
  message: string | null;
  data: {
    title: string;
    description: string;
    services: IPointsServiceDto[];
  };
}
