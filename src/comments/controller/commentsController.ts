import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { CommentsService } from "../application/comments.service";
import {
  RequestWithParamsAndBody,
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
import {
  CommentLikeStatusDto,
  LikeStatusRequest,
} from "../../likes/likeStatusType";

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

  async updateLikeStatus(
    req: RequestWithParamsAndBody<{ id: string }, LikeStatusRequest>,
    res: Response,
  ) {
    try {
      if (!req.userId) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }
      const dto: CommentLikeStatusDto = {
        status: req.body.likeStatus,
        commentId: req.params.id,
        userId: req.userId,
      };
      const result = await this.commentsService.updateLikeStatus(dto);
      if (result.status !== ResultStatus.Success) {
        return res.status(HttpStatus.NotFound).send(result.extensions);
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (err: unknown) {
      console.log(err);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }
}
