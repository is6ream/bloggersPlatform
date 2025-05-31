import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export function findBlogHandler(req: Request, res: Response) {
  const findBlog = blogsRepository.findById(req.params.id);
  res.status(HttpStatus.Ok).send(findBlog);
}
