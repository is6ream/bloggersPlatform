import { PaginationAndSorting } from "../../core/types/paginationAndSorting/pagination-and-sorting";
import { PostSortField } from "./post-sort-field";
export type PostQueryInput = PaginationAndSorting<PostSortField> &
  Partial<{
    searchPostNameTerm: string;
  }>;
