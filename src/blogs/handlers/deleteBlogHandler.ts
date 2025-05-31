import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  blogsRepository.delete(id);
  res.status(HttpStatus.NoContent).send();
}
