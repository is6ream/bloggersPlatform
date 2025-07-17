import { UserSortField } from "./user-sort-field";
import { PaginationAndSorting } from "../../core/types/paginationAndSorting/pagination-and-sorting";

export type UserQueryInput = PaginationAndSorting<UserSortField> &
  Partial<{
    searchLoginTerm: string;
    searchEmailTerm: string;
  }>;
