import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { BlogQueryInput } from "../input/blog-query.input";
import { setDefaultPaginationIfNotExist } from "../../../core/helpers/set-default-sort-and-pagination";
import { mapToBlogListPaginatedOutput } from "../mappers/map-to-blog-list-paginated-output.util";
import { blogQueryRepository } from "../../repositories/blogs.query.repository";

export async function getAllBlogsHandler(
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultPaginationIfNotExist(req.query);

    const { items, totalCount } = await blogQueryRepository.findAll(queryInput);

    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: Number(queryInput.pageNumber),
      pageSize: Number(queryInput.pageSize),
      totalCount,
    });

    res.status(HttpStatus.Ok).send(blogsListOutput);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
