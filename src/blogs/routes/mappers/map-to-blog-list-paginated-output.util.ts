import { WithId } from "mongodb";
import { BlogType } from "../../types/blogs-types";
import { ResourceType } from "../../../core/types/resource-type";
import { BlogListPaginatedOutput } from "../output/blog-list-paginated.output";
import { BlogDataOutput } from "../output/blog-data.output";

export function mapToBlogListPaginatedOutput(
  blogs: WithId<BlogType>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number }
): BlogListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    items: blogs.map(
      (blog): BlogDataOutput => ({
        type: ResourceType.Blogs,
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })
    ),
  };
}
