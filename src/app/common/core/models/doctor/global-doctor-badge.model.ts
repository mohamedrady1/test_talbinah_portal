export interface IGlobalDoctorBadgeModel {
  id: number;
  name: string;
  description: string | null;
  type: string;
  display_type: string;
  condition_type: string;
  display_condition_type: string;
  condition_value: number;
  doctor_percentage: number | null;
  color: string;
  icon: string;
  is_active: number;
  created_at: string;
}
