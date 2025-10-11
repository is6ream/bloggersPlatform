import { CommentsQueryRepository } from "../infrastructure/commentsQueryRepository";
import { RequestWithParams } from "../../core/types/common/requests";
import { IdType } from "../../core/types/authorization/id";
import { Response } from "express";
import { CommentViewModel } from "../types/commentsTypes";
import { HttpStatus } from "../../core/http-statuses";
import { createErrorMessages } from "../../core/errors/create-error-message";

export class CommentsQueryController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}
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
}
