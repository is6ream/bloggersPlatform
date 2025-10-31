import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { CommentsService } from "../application/comments.service";
import {
  RequestWithBody,
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "../../core/types/common/requests";
import { IdType } from "../../core/types/authorization/id";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import {
  CommentCreateType,
  CommentId,
} from "../types/input/updateCommentTypes";
import { inject, injectable } from "inversify";
import { LikeStatus } from "../likes/likesMongoose";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) private commentsService: CommentsService,
  ) {}

  async deleteComment(
    req: RequestWithParamsAndUserId<CommentId, IdType>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      const userId = req.userId!;
      const result = await this.commentsService.delete(id, userId);
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

  async updateComment(
    req: RequestWithParamsAndBodyAndUserId<
      CommentId,
      CommentCreateType,
      IdType
    >,
    res: Response,
  ) {
    try {
      if (!req.userId) {
        return res.status(HttpStatus.Unauthorized).send();
      }
      const userId = req.userId;
      const id = req.params.id;
      const content = req.body.content;
      const result = await this.commentsService.update(id, { content }, userId);

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

  async updateLikeStatus(req: RequestWithParamsAndBody<LikeStatus>, res: Response) {
      //нужно прописать тип для реквеста
    const status = req.body;
    const userId = req.userId;
    const commentId = req.params.
    console.log(status, "status check");
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
