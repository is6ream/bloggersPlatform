import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { postsService } from "../application/post.service";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util";
import { PostQueryInput } from "../input/post-query.input";

export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    const queryInput: PostQueryInput = setDefaultPaginationIfNotExist(
      req.query,
    );

    const { items, totalCount } = await postsService.findMany(queryInput);

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
