import { SahredConstants } from '../../../utilities';
import { ISoftDeletablePaginationParameters } from '../interfaces/pagination-parameters.interface';

export const defaultPaginationParameters: ISoftDeletablePaginationParameters = {
  // isActive: true
  page: SahredConstants.INITIAL_PAGE_INDEX,
  per_page: SahredConstants.INITIAL_PAGE_SIZE,
  total: SahredConstants.INITIAL_TOTAL_SIZE
};

export const defaultListPaginationParameters: ISoftDeletablePaginationParameters = {};
