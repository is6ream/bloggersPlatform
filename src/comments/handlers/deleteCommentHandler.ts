import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import {
  CommentsService,
  commentsService,
} from "../application/comments.service";
import {
  RequestWithParams,
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
import { createErrorMessages } from "../../core/errors/create-error-message";
import {
  commentsQueryRepository,
  CommentsQueryRepository,
} from "../infrastructure/commentsQueryRepository";
import { CommentViewModel } from "../types/commentsTypes";

class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
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

  async getCommentById(req: RequestWithParams<IdType>, res: Response) {
    try {
      const id: string = req.params.id;
      const comment: null | CommentViewModel =
        await this.commentsQueryRepository.findById(id);
      if (!comment) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([
              { field: "id", message: "comment not found" },
            ]),
          );
      }
      res.status(HttpStatus.Ok).send(comment);
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
}

export const commentsController = new CommentsController(
  commentsService,
  commentsQueryRepository,
);
