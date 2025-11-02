export interface PaginationConfig {
  totalPages: number;
  currentPage: number;
  maxVisible?: number;
  onPageChange: (page: number) => void;
}
