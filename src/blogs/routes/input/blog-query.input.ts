import { BlogSortField } from "./blog-sort-field";
import { PaginationAndSorting } from "../../../core/types/paginationAndSorting/pagination-and-sorting";

export type BlogQueryInput = PaginationAndSorting<BlogSortField> &
  Partial<{
    searchNameTerm: string;
  }>;
