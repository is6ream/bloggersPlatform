import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { commentsService } from "../application/comments.service";
import { RequestWithParamsAndUserId } from "../../core/types/common/requests";
import { IdType } from "../../core/types/authorization/id";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { CommentId } from "../types/input/updateCommentTypes";

export async function deleteCommentHandler(
  req: RequestWithParamsAndUserId<CommentId, IdType>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const userId = req.user!.id;
    const result = await commentsService.delete(id, userId);
    if (result.status !== ResultStatus.Success) {
      res.sendStatus(resultCodeToHttpException(result.status)).send();
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
