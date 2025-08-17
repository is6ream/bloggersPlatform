import { PostDataOutput } from "./../output/post-data-output";
import { WithId } from "mongodb";
import { PostDB } from "../types/posts-types";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";

export function mapToPostListPaginatedOutput(
  posts: WithId<PostDB>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,

    items: posts.map(
      (post): PostDataOutput => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      }),
    ),
  };
}
