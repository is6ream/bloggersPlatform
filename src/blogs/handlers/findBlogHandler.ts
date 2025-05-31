import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";

export function findBlogHandler(req: Request, res: Response) {
  const findBlog = blogsRepository.findById(req.params.id);
  res.status(200).send(findBlog);
}
