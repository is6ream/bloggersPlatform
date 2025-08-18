import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { HttpStatus } from "../../core/http-statuses";
import {
  CommentCreateType,
  CommentId,
} from "../types/input/updateCommentTypes";
import { RequestWithParamsAndBodyAndUserId } from "../../core/types/common/requests";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { IdType } from "../../core/types/authorization/id";

export async function updateCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<CommentId, CommentCreateType, IdType>,
  res: Response,
) {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const content = req.body.content;
    const result = await commentsService.update(id, { content }, userId);

    if (result.status !== ResultStatus.Success) {
      res.status(resultCodeToHttpException(result.status)).send();
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
