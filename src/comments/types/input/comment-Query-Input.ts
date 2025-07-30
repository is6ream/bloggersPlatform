import { CommentsSortField } from "./comment-sort-field";
import { PaginationAndSorting } from "../../../core/types/paginationAndSorting/pagination-and-sorting";

export type CommentsQueryInput = PaginationAndSorting<CommentsSortField> &
  Partial<{
    searchContentTerm: string;
    searchDateTerm: string;
  }>;
