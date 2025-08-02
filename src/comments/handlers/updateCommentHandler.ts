import { Request, Response } from "express";
import { commentsService } from "../application/comments.service";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";

export async function updateCommentHandler(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const dataForUpdate = req.body;
    const result = await commentsService.update(id, dataForUpdate);

    if (result === null) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Comment not found" }])
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
