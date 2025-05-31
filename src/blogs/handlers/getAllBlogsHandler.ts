import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";

export function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll;
  res.status(200).json(blogs);
}
