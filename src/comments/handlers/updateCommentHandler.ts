import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";
import {
  CommentCreateType,
  CommentId,
} from "../types/input/updateCommentTypes";
import { RequestWithBodyAndParams } from "../../core/types/common/requests";

export async function updateCommentHandler(
  req: RequestWithBodyAndParams<CommentId, CommentCreateType>,
  res: Response
) {
  try {
    const id = req.params.commentId;
    const dataForUpdate = req.body.content;
    const result = await commentsService.update(id, dataForUpdate);

    if (result === null) {
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
