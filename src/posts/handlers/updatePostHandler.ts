import { Request, Response } from "express";
import { postRepository } from "../repositories/postRepository";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";
export async function updatePostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await postRepository.update(id, req.body);
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
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
