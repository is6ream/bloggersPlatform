import { IdType } from "../../core/types/authorization/id";
import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { commentsQueryRepository } from "../infrastructure/commentsQueryRepository";
import { RequestWithParams } from "../../core/types/common/requests";
import { CommentViewModel } from "../types/commentsTypes";
import { createErrorMessages } from "../../core/errors/create-error-message";

export async function getCommentByIdHandler(
  req: RequestWithParams<IdType>,
  res: Response,
) {
  try {
    const id: string = req.params.id;
    const comment: null | CommentViewModel =
      await commentsQueryRepository.findById(id);
    if (!comment) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "comment not found" }]),
        );
    }
    res.status(HttpStatus.Ok).send(comment);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
