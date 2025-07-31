import { HttpStatus } from "../../core/http-statuses";
import { IdType } from "../../core/types/authorization/id";
import { RequestWithParamsAndBodyAndUserId } from "../../core/types/requests/requests";
import { Response } from "express";
import { commentsService } from "../application/comments.service";
import { ContentType } from "../types/commentsTypes";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";

export async function createCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<string, ContentType, IdType>,
  res: Response
) {
  const userId = req.user?.id as string;
  const content = {
    comment: req.body,
    userId: userId,
    postId: req.params,
  };
  if (!userId) res.sendStatus(HttpStatus.Unauthorized);
  const commentId = await commentsService.createComment(content);
  const dataForResponse = await commentsQueryRepository.findById(commentId);
  res.status(HttpStatus.Created).send(dataForResponse);
}
