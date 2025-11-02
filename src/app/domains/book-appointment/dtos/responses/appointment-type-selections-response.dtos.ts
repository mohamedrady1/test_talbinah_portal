export interface IAppointmentTypeSelectionItem {
  id: number;                     // API returns a numeric ID
  name: string;
  description?: string | null;
  image?: string | null;
  color?: string | null;
  is_report?: number;              // 1 or 0
  active?: number;                 // 1 or 0
  original_active?: string;        // e.g., "فعال"

  // Extra fields from the API
  action_text?: string | null;
  first_color?: string | null;
  second_color?: string | null;
  begin?: string | null;           // e.g., "topCenter"
  end?: string | null;             // e.g., "bottomCenter"
  action_color?: string | null;
}

export interface IAppointmentTypeSelectionsResponseDto {
  status: boolean;
  message?: string | null;
  data?: IAppointmentTypeSelectionItem[] | null;
}
