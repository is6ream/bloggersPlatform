import { postValidators } from "./../../core/middlewares/postValidation/post-input-dto.validation";
import { Router } from "express";
import { getAllPostsHandler } from "../handlers/getAllpostsHandler";
import { createPostHandler } from "../handlers/createPostHandler";
import { findPostHandler } from "../handlers/findPostHandler";
import { updatePostHandler } from "../handlers/updatePostHandler";
import { deletePostHandler } from "../handlers/deletePostHandler";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteAllPosts } from "../handlers/deleteAllPostsHandler";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../input/post-sort-field";

export const postRouter = Router();

postRouter
  .delete("/all-data", deleteAllPosts)

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
  );
