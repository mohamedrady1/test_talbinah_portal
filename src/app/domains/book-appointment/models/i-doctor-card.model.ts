import { INextAvailability } from "../dtos";

export interface IDoctor {
  id: number;
  full_name: string;
  specialist: string[];
  specialist_id: number[];
  bio: string;
  gender: number;
  isRecommended?: boolean;
  reservation_count: number;
  is_recommended?: boolean;
  avg_rate: number;
  count_rate: number;
  image: string | null;
  price_half_hour: number;
  years_experience: number;
  copouns: any[];
  nextAvailability: INextAvailability;
  reviews_avg?: number;
  reviews_count?: number;
}
