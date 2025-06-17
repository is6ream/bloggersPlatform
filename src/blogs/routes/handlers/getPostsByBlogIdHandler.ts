import { Request, Response } from "express";
import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { HttpStatus } from "../../../core/http-statuses";
import { postsService } from "../../../posts/application/post.service";
import { mapToPostListPaginatedOutput } from "../../../posts/mappers/map-to-post-list-paginated-output.util";
import { PostQueryInput } from "../../../posts/input/post-query.input";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function getPostsByBlogId(req: Request, res: Response) {
  try {
    const queryInput: PostQueryInput = setDefaultPaginationIfNotExist(
      req.query,
    );
    const { id: blogId } = req.params;
    const foundBlog = await blogsRepository.findById(blogId);
    if (!foundBlog) return res.sendStatus(404);
    const { items, totalCount } = await postsService.getPostsByBlogId(
      blogId,
      queryInput,
    );

    const postsListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.status(200).send(postsListOutput);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
