import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  await blogsRepository.delete(id);
  res.status(HttpStatus.NoContent).send();
}
