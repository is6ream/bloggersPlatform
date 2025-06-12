import { HttpStatus } from "../../../core/http-statuses";
import { blogsRepository } from "../../repositories/blogs.repository";
import { Request, Response } from "express";

export async function deleteAllBlogs(req: Request, res: Response) {
  await blogsRepository.deleteAll();
  res.status(HttpStatus.NoContent).send();
  return;
}
