import { PostDataOutput } from "./post-data-output";
import { PaginatedOutput } from "../../core/types/paginationAndSorting/paginated.output";

export type PostListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostDataOutput[];
};
