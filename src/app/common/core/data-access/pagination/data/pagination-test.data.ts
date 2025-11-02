import { arrayUtils } from '../../../utilities/data-structures';
import { IPaginationResponse } from '../interfaces/pagination-response.interface';

function createPaginationResponse<TObject>({
  index,
  itemFactory
}: ICreatePaginationResponseParams<TObject>): IPaginationResponse<TObject> {
  return {
    items: arrayUtils.createListOfObjects(index, itemFactory),
    paginationMetadata: {
      totalItemCount: index,
      numberOfPages: 1,
      pageSize: index,
      order: 'asc',
      page: 1,
      hasNext: false,
      hasPrevious: false
    }
  };
}

export const paginationDataUtils = {
  createPaginationResponse
};

export interface ICreatePaginationResponseParams<TObject> {
  index: number;
  itemFactory: (index: number) => TObject;
}
