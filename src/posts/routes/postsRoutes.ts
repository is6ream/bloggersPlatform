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
import { postsController, postsQueryController} from "../../compositionRoot";

export const postRouter = Router();

postRouter
  .get(
    "/",
    paginationAndSortingValidation(PostSortField),
    postsQueryController.getAllPosts.bind(postsQueryController),
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    postValidators,
    inputValidationResultMiddleware,
    postsController.createPost.bind(postsController),
  )
  .get(
    //перенести в queryController
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    postsQueryController.findPost.bind(postsQueryController),
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postValidators,
    inputValidationResultMiddleware,
    postsController.updatePost.bind(postsController),
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.deletePost.bind(postsController),
  )
  .post(
    "/:id/comments",
    accessTokenGuard,
    commentValidator,
    inputValidationResultMiddleware,
    postsController.createComment.bind(postsController),
  )

  .get(
    "/:id/comments", //перенести в query
    paginationAndSortingValidation(CommentsSortField),
    idValidation,
    postsQueryController.getCommentByPostId.bind(postsQueryController),
  );
