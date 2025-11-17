import { PostViewModel } from "../types/posts-types";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";

export function mapToPostListPaginatedOutput(
  posts: PostViewModel[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,

    items: posts,
  };
}
