import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function updateBlogHandler(req: Request, res: Response) {
  await blogsRepository.update(req.params.id, req.body);
  res.status(HttpStatus.NoContent).send();
}
