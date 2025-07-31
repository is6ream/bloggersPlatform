import { HttpStatus } from "../../core/http-statuses";
import { IdType } from "../../core/types/authorization/id";
import { RequestWithParamsAndBodyAndUserId } from "../../core/types/requests/requests";
import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { ContentType } from "../types/commentsTypes";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";
import { ResultStatus } from "../../core/result/resultCode";

export async function createCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<string, ContentType, IdType>,
  res: Response,
) {
  try {
    const userId = req.user?.id as string;
    const content = {
      comment: req.body,
      userId: userId,
      postId: req.params,
    };
    if (!userId) res.sendStatus(HttpStatus.Unauthorized);
    const result = await commentsService.createComment(content);
    if (result.status === ResultStatus.Success) {
      const dataForResponse = await commentsQueryRepository.findById(
        result.data!.commentId,
      );
      res.status(HttpStatus.Created).send(dataForResponse);
    }
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
