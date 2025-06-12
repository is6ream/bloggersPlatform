import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/http-statuses";
import { BlogQueryInput } from "../input/blog-query.input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { blogsService } from "../application/blogs.service";

export async function getAllBlogsHandler(
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response
) {
  try {
    const queryInput = setDefaultPaginationIfNotExist(req.query);

    const { items, totalCount } = await blogsService.findMany(queryInput);
    const blogs = await blogsRepository.findAll();
    res.status(HttpStatus.Ok).json(blogs);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
