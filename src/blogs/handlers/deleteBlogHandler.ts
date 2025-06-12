import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/error.utils";

export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await blogsRepository.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }]),
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
      return;
    }
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
