import { postValidators } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { Router } from "express";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../input/post-sort-field";
import { accessTokenGuard } from "../../core/guards/access.token.guard";
import { CommentsSortField } from "../../comments/types/input/comment-sort-field";
import { commentValidator } from "../../core/middlewares/commentValidation/comment-input-dto.validation";
export const postRouter = Router();
import { postController } from "../api/postsController";

postRouter
  .get(
    "/",
    paginationAndSortingValidation(PostSortField),
    postController.getAllPosts,
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    postValidators,
    inputValidationResultMiddleware,
    postController.createPost,
  )
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    postController.findPost,
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postValidators,
    inputValidationResultMiddleware,
    postController.updatePost,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postController.deletePost,
  )
  .post(
    "/:id/comments",
    accessTokenGuard,
    commentValidator,
    inputValidationResultMiddleware,
    postController.createComment,
  )

  .get(
    "/:id/comments",
    paginationAndSortingValidation(CommentsSortField),
    idValidation,
    postController.getCommentByPostId,
  );
