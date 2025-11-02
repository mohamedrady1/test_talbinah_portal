// src/app/features/mental-health-scales/dtos/my-mental-health-scales-response.dto.ts

import { IPaginationMeta } from "../../../talbinah-community";
import { IMentalHealthScaleListItemDto } from "./mental-health-scales-listing-response.dto"; // <-- Corrected import path


export interface IMyMentalHealthScalesResponseDto {
  status: boolean;
  message: string | null;
  data: IMentalHealthScaleListItemDto[];
  meta: IPaginationMeta; // <-- ADDED: Pagination metadata
}