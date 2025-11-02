export interface IReasonsCancelationListingResponseDto {
  status: boolean;
  message: string | null;
  data: ICancelationReasonItem[];
}

export interface ICancelationReasonItem {
  id: number;
  reason: string;
  type: number; // 0 = Patient, etc.
  original_type: string; // Arabic label (e.g., "مريض")
  active: number; // 1 = Active
  original_active: string; // Arabic label (e.g., "فعال")
}
