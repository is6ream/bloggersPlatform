import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { contentValidator } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { createCommentHandler } from "../handlers/createCommentHandler";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { CommentsSortField } from "../types/input/comment-sort-field";
import { getAllCommentsHandler } from "../handlers/getAllCommentsHandler";

export const commentsRouter = Router();

commentsRouter
  .get(
    "/",
    paginationAndSortingValidation(CommentsSortField),
    getAllCommentsHandler,
  )
  .post(
    "/posts/:id/comments",
    accessTokenGuard,
    contentValidator,
    inputValidationResultMiddleware,
    createCommentHandler,
  );
