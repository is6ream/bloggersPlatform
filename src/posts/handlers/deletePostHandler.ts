import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { postRepository } from "../repositories/postRepository";
import { createErrorMessages } from "../../core/error.utils";

export async function deletePostHandler(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const result = await postRepository.delete(id);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Blog not found" }]),
        );
      return;
    } else {
      res.status(HttpStatus.NoContent).send();
    }
    return;
  } catch (error: unknown) {
    // console.log(error);
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
