import { postValidators } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { Router } from "express";
import { getAllPostsHandler } from "../handlers/getAllpostsHandler";
import { createPostHandler } from "../handlers/createPostHandler";
import { findPostHandler } from "../handlers/findPostHandler";
import { updatePostHandler } from "../handlers/updatePostHandler";
import { deletePostHandler } from "../handlers/deletePostHandler";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../input/post-sort-field";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { createCommentHandler } from "../../comments/handlers/createCommentHandler";
import { CommentsSortField } from "../../comments/types/input/comment-sort-field";
import { getCommentByPostId } from "../../comments/handlers/getCommentByPostId";
import { commentValidator } from "../../core/middlewares/commentValidation/comment-input-dto.validation";
export const postRouter = Router();

postRouter
  .get("/", paginationAndSortingValidation(PostSortField), getAllPostsHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    postValidators,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .get("/:id", idValidation, inputValidationResultMiddleware, findPostHandler)

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postValidators,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  )
  .post(
    "/:id/comments",
    accessTokenGuard,
    commentValidator,
    inputValidationResultMiddleware,
    createCommentHandler,
  )

  .get(
    "/:id/comments",
    paginationAndSortingValidation(CommentsSortField),
    idValidation,
    getCommentByPostId,
  );
