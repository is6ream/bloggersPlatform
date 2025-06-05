import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function getAllBlogsHandler(req: Request, res: Response) {
  const blogs = await blogsRepository.findAll();
  res.status(HttpStatus.Ok).json(blogs);
}
