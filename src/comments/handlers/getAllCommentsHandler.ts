import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";
import { mapToCommentListPaginatedOutput } from "../mappers/mapToCommentListPaginatedOutput";

export async function getAllCommentsHandler(
  req: Request<{}, {}, {}, CommentsQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultPaginationIfNotExist(req.query);
    const { items, totalCount } =
      await commentsQueryRepository.findAll(queryInput);

    const commentsListOutput = mapToCommentListPaginatedOutput(items, {
      pageNumber: Number(queryInput.pageNumber),
      pageSize: Number(queryInput.pageSize),
      totalCount,
    });
    res.status(HttpStatus.Ok).send(commentsListOutput);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
