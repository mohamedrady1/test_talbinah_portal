
export interface INormalPackagesReservationRequestDto {
  doctor_id: number;
  day_id: number;
  start_time: string;
  end_time: string;
  date: string
  duration_id: number;
  communication_id: number;
}


export interface IStoreNormalPackagesReservationRequestDto {
  start_time: string; // e.g., "13:30"
  end_time: string;   // e.g., "14:00"
  day_id: number | null;

  payment_id: number;
  full_name: string;
  gender: number | string;
  problem: string;
  age: number;

  doctor_id: number;
  duration_id: number;
  communication_id: number;
  date: string; // e.g., "2025-07-02"

  package_id?: string | null;
  sessions?: {
    start_time: string; // e.g., "13:30"
    end_time: string;   // e.g., "14:00"
    day_id: number;
    date: string;
  }[];
  coupon_id?: number | null;
}
