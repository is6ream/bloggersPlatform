import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function updateBlogHandler(req: Request, res: Response) {
  try {
    await blogsRepository.update(req.params.id, req.body);
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
  //закончил с репозиторием постов
}
