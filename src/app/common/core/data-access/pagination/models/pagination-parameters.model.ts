import { IPaginationParameters } from '../interfaces';

export class PaginationParametersModel implements IPaginationParameters {
  private static DefaultPage: number = 1;
  private static DefaultPageSize: number = 10;

  sortColumn?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  per_page?: number;

  private constructor(params?: IPaginationParameters) {
    this.sortColumn = params?.sortColumn;
    this.sortOrder = params?.sortOrder;
    this.search = params?.search;
    this.page = params?.page ?? PaginationParametersModel.DefaultPage;
    this.per_page = params?.per_page ?? PaginationParametersModel.DefaultPageSize;
  }

  static create(params: IPaginationParameters): PaginationParametersModel {
    return new PaginationParametersModel(params);
  }

  static createDefault() {
    return new PaginationParametersModel();
  }

  update(params?: IPaginationParameters) {
    this.sortColumn = params?.sortColumn ?? this.sortColumn;
    this.sortOrder = params?.sortOrder ?? this.sortOrder;
    this.search = params?.search ?? this.search;
    this.page = params?.page ?? this.page;
    this.per_page = params?.per_page ?? this.per_page;
  }
}
