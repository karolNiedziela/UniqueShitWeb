export interface PagedListModel<T> {
  hasNextPage: boolean;
  hasPreviosPage: boolean;
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}
