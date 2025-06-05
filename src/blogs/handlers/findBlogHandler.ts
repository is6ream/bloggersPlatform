import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function findBlogHandler(req: Request, res: Response) {
  const findBlog = await blogsRepository.findById(req.params.id);
  res.status(HttpStatus.Ok).send(findBlog);
}
