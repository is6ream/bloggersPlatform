import { Request, Response } from "express";
import { postQueryRepository } from "../../posts/repositories/postQueryRepository";
import { HttpStatus } from "../../core/http-statuses";
import { CommentsQueryInput } from "../types/input/comment-Query-Input";
import { setDefaultPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { commentsQueryRepository } from "../repositories/commentsQueryRepository";
import { ResultStatus } from "../../core/result/resultCode";

export async function getCommentByPostId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const queryInput: CommentsQueryInput = setDefaultPaginationIfNotExist(
      req.query,
    );
    const { id: postId } = req.params;
    const foundPost = await postQueryRepository.findById(postId);
    if (foundPost.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    const { items, totalCount } =
      await commentsQueryRepository.findCommentByPostId(queryInput, postId);
    res.status(HttpStatus.Ok).send(foundPost);
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
