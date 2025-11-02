import { IPaginationResponse, PaginationMetadata } from '../..';

export class PaginationResponseModel<TEntity> implements IPaginationResponse<TEntity> {
  items: TEntity[];
  paginationMetadata: PaginationMetadata;

  constructor(response: IPaginationResponse<TEntity>) {
    this.items = response.items;
    this.paginationMetadata = response.paginationMetadata;
  }

  static create<TEntity>(response: IPaginationResponse<TEntity>) {
    return new PaginationResponseModel(response);
  }

  static createDefault() {
    return new PaginationResponseModel({
      items: [],
      paginationMetadata: {
        totalItemCount: 0,
        numberOfPages: 1,
        pageSize: 10,
        order: 'ASC',
        page: 1,
        hasNext: false,
        hasPrevious: false
      }
    });
  }

  getTableConfig(): any {
    throw new Error('You have to override this');
  }
}
