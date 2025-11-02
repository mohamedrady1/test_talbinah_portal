export interface IReasonsSchedulingLookupsResponseDto {
  status: boolean;
  message: string | null;
  data: ISchedulingReasonItem[];
}

export interface ISchedulingReasonItem {
  id: number;
  reason: string;
  type: number; // 0 = Patient, etc.
  original_type: string; // Arabic label (e.g., "مريض")
  active: number; // 1 = Active
  original_active: string; // Arabic label (e.g., "فعال")
}
