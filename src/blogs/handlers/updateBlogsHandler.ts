import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export function updateBlogHandler(req: Request, res: Response) {
  blogsRepository.update(req.params.id, req.body);
  res.status(HttpStatus.NoContent).send();
}
