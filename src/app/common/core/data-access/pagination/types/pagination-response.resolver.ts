import { Observable } from 'rxjs';
import { IPaginationParameters, IPaginationResponse } from '../interfaces';
import { IEntity } from '../../../utilities/pagination/IEntity.interface';

export type paginationResponseResolver<
  TEntity extends IEntity<string>,
  TPaginationParameters extends IPaginationParameters
> = (params?: TPaginationParameters) => Observable<IPaginationResponse<TEntity>>;

export interface IPaginationResponseResolver<
  TEntity extends IEntity<string>,
  TPaginationParameters extends IPaginationParameters
> {
  get: (params?: TPaginationParameters) => Observable<IPaginationResponse<TEntity>>;
}
