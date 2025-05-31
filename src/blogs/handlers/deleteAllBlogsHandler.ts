import { HttpStatus } from "../../core/types";
import { blogsRepository } from "../repositories/blogs.repository";
import { Request, Response } from "express";

export function deleteAllBlogs(req: Request, res: Response) {
  blogsRepository.deleteAll();
  res.status(HttpStatus.NoContent).send();
}
