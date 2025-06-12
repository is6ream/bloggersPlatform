import { PaginationAndSorting } from "../types/pagination-and-sorting";
import { paginationAndSortingDefault } from "../middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";

export function setDefaultPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
