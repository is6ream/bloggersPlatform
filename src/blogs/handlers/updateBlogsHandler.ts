import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";

export function updateVideoHandler(req: Request, res: Response) {
  blogsRepository.update(req.params.id, req.body);
  res.status(204).send();
}
