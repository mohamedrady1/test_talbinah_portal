// src/app/features/mental-health-scales/dtos/mental-health-scales-listing-response.dto.ts

import { IDoctorItem } from "../../../../shared";
import { IMentalResult, ISuggestedDoctor } from "./create-scale-response.dto";

export interface IMentalHealthScalesListingResponseDto {
  status: boolean;
  message: string | null;
  data: IMentalHealthScaleListItemDto[];
}

export interface IMentalHealthScaleListItemDto {
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
  created_at: string; // Consider using Date if you parse it
  updated_at: string; // Consider using Date if you parse it
  questions: IMentalHealthQuestionDto[];
  results: IMentalHealthResultDto[];
}

export interface IMentalHealthQuestionDto {
  id: number;
  mental_category_id: number;
  question: string;
  isSelected?: boolean;
  question_grade: number;
  header_title: string | null;
  footer_title: string | null;
  created_at: string;
  updated_at: string;
  answers: IMentalHealthAnswerDto[];
}

export interface IMentalHealthAnswerDto {
  id: number;
  mental_category_id: number;
  mental_question_id: number;
  answer: string;
  selected: number; // This might be a boolean in some contexts (0/1)
  answer_grade: number;
  created_at: string;
  updated_at: string;
}

export interface IMentalHealthResultDto {
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
  suggest_doctor: IDoctorItem | ISuggestedDoctor | null | any;
  created_at: string;
  icon?: string | null;
  mental_results?: IMentalResult[];
}
