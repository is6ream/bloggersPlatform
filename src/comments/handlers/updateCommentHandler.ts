import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";
import {
  CommentCreateType,
  CommentId,
} from "../types/input/updateCommentTypes";
import { RequestWithBodyAndParams } from "../../core/types/common/requests";
import { ResultStatus } from "../../core/result/resultCode";

export async function updateCommentHandler(
  req: RequestWithBodyAndParams<CommentId, CommentCreateType>, //т.е тут он уже undefined идет
  res: Response,
) {
  try {
    const id = req.params.id;
    const content = req.body.content;
    const result = await commentsService.update(id, { content });

    if (result.status !== ResultStatus.Success) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "Comment not found" }]),
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
