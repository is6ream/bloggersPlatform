import { Router } from "express";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { contentValidator } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { createCommentHandler } from "../handlers/createCommentHandler";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { CommentsSortField } from "../types/input/comment-sort-field";
import { getAllCommentsHandler } from "../handlers/getAllCommentsHandler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteCommentHandler } from "../handlers/deleteCommentHandler";
import { updateCommentHandler } from "../handlers/updateCommentHandler";

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
  )
  .delete(
    "/:id",
    accessTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  )
  .put(
    "/:id",
    accessTokenGuard,
    idValidation,
    contentValidator,
    inputValidationResultMiddleware,
    updateCommentHandler,
  );
