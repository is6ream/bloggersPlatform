import { PostDataOutput } from "./../output/post-data-output";
import { WithId } from "mongodb";
import { PostType } from "../types/posts-types";
import { ResourceType } from "../../core/types/resource-type";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";

export function mapToPostListPaginatedOutput(
  posts: WithId<PostType>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: posts.map(
      (post): PostDataOutput => ({
        type: ResourceType.Posts,
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
