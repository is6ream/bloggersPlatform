import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";

export function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  blogsRepository.delete(id);
  res.status(204).send();
}
