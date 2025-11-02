export interface PaginationMetadata {
  totalItemCount: number;
  numberOfPages?: number;
  pageSize: number;
  order: string;
  page: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}
