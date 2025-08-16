import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";
import { postsService } from "../application/post.service";

//не падает ошибка при неверно введенном id
export async function updatePostHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await postsService.update(id, req.body);
    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Post not found" }]),
        );
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
