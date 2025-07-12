import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/http-statuses";
import { createErrorMessages } from "../../../core/errors/create-error-message";
export async function updateBlogHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await blogsRepository.update(id, req.body);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }]),
        );
      return;
    }
    res.status(HttpStatus.NoContent).send();
    return;
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
