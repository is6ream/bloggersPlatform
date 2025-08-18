import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { HttpStatus } from "../../core/http-statuses";
import {
  CommentCreateType,
  CommentId,
} from "../types/input/updateCommentTypes";
import { RequestWithBodyAndParams } from "../../core/types/common/requests";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";

export async function updateCommentHandler(
  req: RequestWithBodyAndParams<CommentId, CommentCreateType>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const content = req.body.content;
    const result = await commentsService.update(id, { content });

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
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
