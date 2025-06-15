import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { PostSortField } from "./post-sort-field";
export type PostQueryInput = PaginationAndSorting<PostSortField> &
  Partial<{
    searchPostNameTerm: string;
  }>;
export type blogId = string;

export type FindPostsQueryInput = PaginationAndSorting<PostSortField> & blogId;
