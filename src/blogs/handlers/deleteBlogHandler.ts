import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/types";

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await blogsRepository.delete(id);
    res.status(HttpStatus.NoContent).send();
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
