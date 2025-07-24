import { Request, Response } from "express";
import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { HttpStatus } from "../../../core/http-statuses";
import { mapToPostListPaginatedOutput } from "../../../posts/mappers/map-to-post-list-paginated-output.util";
import { PostQueryInput } from "../../../posts/input/post-query.input";
import { blogQueryRepository } from "../../repositories/blogs.query.repository";
import { postQueryRepository } from "../../../posts/repositories/postQueryRepository";

export async function getPostsByBlogId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const queryInput: PostQueryInput = setDefaultPaginationIfNotExist(
      req.query,
    );
    const { id: blogId } = req.params;
    const foundBlog = await blogQueryRepository.findById(blogId);
    if (!foundBlog) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    const { items, totalCount } = await postQueryRepository.findPostsByBlogId(
      queryInput,
      blogId,
    );

    const postsListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: Number(queryInput.pageNumber),
      pageSize: Number(queryInput.pageSize),
      totalCount,
    });
    res.status(200).send(postsListOutput);
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
