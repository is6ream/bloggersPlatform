import { IdType } from "./../../core/types/authorization/id";
import { Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";
import { RequestWithParams } from "../../core/types/common/requests";
import { CommentViewModel } from "../types/commentsTypes";
import { createErrorMessages } from "../../core/errors/create-error-message";
// export async function getAllCommentsHandler(
//   req: Request<{}, {}, {}, CommentsQueryInput>,
//   res: Response
// ) {
//   try {
//     const queryInput = setDefaultPaginationIfNotExist(req.query);
//     const { items, totalCount } =
//       await commentsQueryRepository.findAll(queryInput);

//     const commentsListOutput = mapToCommentListPaginatedOutput(items, {
//       pageNumber: Number(queryInput.pageNumber),
//       pageSize: Number(queryInput.pageSize),
//       totalCount,
//     });
//     res.status(HttpStatus.Ok).send(commentsListOutput);
//   } catch (error: unknown) {
//     console.log(error);
//     res.sendStatus(HttpStatus.InternalServerError);
//   }
// }

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
