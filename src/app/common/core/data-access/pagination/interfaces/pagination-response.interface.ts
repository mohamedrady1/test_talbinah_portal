import { PaginationMetadata } from './pagination-metadata.interface';

export interface IPaginationResponse<TEntity> {
  items: TEntity[];
  paginationMetadata: PaginationMetadata;
}
export interface IPaginationData {
  currentPage?: number;
  totalItems?: number;
  totalPages: number;
  pageSize: number;
  itemsOnPage: number;
  startIndex?: number;
  endIndex?: number;
  nextCursor?: string | null;
  prevCursor?: string | null;
  sortBy?: string;
  filterParams?: any; // Or a more specific interface if filters are complex
}
