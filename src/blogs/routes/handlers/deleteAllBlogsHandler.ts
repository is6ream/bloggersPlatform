import { HttpStatus } from "../../../core/http-statuses";
import { blogsService } from "../../application/blogs.service";
import { Request, Response } from "express";

export async function deleteAllBlogs(req: Request, res: Response) {
  await blogsService.deleteAll();
  res.status(HttpStatus.NoContent).send();
  return;
}
