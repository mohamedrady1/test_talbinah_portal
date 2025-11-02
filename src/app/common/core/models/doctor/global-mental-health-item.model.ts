import { IGlobalDoctorContactInfoModel } from "./global-doctor-contact-info.model";

export interface IGlobalMentalHealthScaleModel {
  id: number;
  title: string;
  color: string;
  icon: string;
  question_number: number;
  duration: number;
  answer_type: string;
  total_grade: number;
  mental_category_name?: string;
  percentage?: number;
  sub_title?: string;
  reference: string;
  brief: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  questions?: IGlobalMentalHealthQuestion[];
  results?: IGlobalMentalHealthResult[];
}

export interface IGlobalMentalHealthResult {
  id: number;
  mental_category_id: number;
  start_percentage: number;
  end_percentage: number;
  result_note: string;
  title: string;
  sub_title: string;
  created_at: string;
  updated_at: string;
}
export interface IMentalHealthReportItemDto {
  mental_category_name: string;
  percentage: number;
  result_note: string;
  title: string;
  sub_title: string;
  suggest_doctor?: IGlobalDoctorContactInfoModel;
  created_at: string;
  icon?: string | null;
  mental_results?: IGlobalMentalResult[];
}
export interface IGlobalMentalHealthQuestion {
  id: number;
  mental_category_id: number;
  question: string;
  isSelected?: boolean;
  question_grade: number;
  header_title: string | null;
  footer_title: string | null;
  created_at: string;
  updated_at: string;
  answers: IGlobalMentalHealthAnswer[];
}

export interface IGlobalMentalHealthAnswer {
  id: number;
  mental_category_id: number;
  mental_question_id: number;
  answer: string;
  selected: number; // This might be a boolean in some contexts (0/1)
  answer_grade: number;
  created_at: string;
  updated_at: string;
}
export interface IGlobalMentalResult {
  id: number;
  mental_category_id: number;
  start_percentage: number;
  end_percentage: number;
  result_note: string;
  title: string;
  sub_title: string;
  created_at: string;
  updated_at: string;
  pivot?: { // This pivot structure indicates a many-to-many relationship
    user_id: number;
    mental_result_id: number;
    result: number; // Score or grade
    created_at: string;
  };
}
