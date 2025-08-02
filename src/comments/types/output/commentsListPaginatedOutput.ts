import { CommentViewModel } from "../commentsTypes";

export type CommentsListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
};
