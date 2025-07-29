import { HttpStatus } from "../../core/http-statuses";
import { IdType } from "../../core/types/authorization/id";
import { RequestWithBodyAndUserId } from "../../core/types/requests/requests";
import { Response } from "express";
import { commentsService } from "../application/comments.service";

export type ContentType = {
  content: string;
};
export async function createCommentHandler(
  req: RequestWithBodyAndUserId<ContentType, IdType>,
  res: Response,
) {
  const userId = req.user?.id as string;
  const content = req.body;
  if (!userId) res.sendStatus(HttpStatus.Unauthorized);
  const commentId = await commentsService.createComment(userId, content);
  const dataForResponse = await commentsQueryRepository.findById(commentId);
  res.status(HttpStatus.Created).send(dataForResponse);
}
