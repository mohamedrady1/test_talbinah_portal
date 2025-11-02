export interface IAppointmentCategory {
  id: string | number;
  name: string;
  color: string;
  image: string;
  created_at: string;
  updated_at: string;
  status?: number | null;
  is_start?: 0 | 1 | null;
  is_end?: 0 | 1 | null;
  badge_class?: string;    // CSS class for styling the badge (e.g., 'badge-success', 'badge-warning')
}
