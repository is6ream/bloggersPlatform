import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll;
  res.status(HttpStatus.Ok).json(blogs);
}
