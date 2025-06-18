import { Router } from "express";
import { inputValidationResultMiddleware } from "../core/middlewares/validation/input-validation-result.middleware";
import { getAllBlogsHandler } from "./routes/handlers/getAllBlogsHandler";
import { createBlogHandler } from "./routes/handlers/createBlogHandler";
import { findBlogHandler } from "./routes/handlers/findBlogHandler";
import { updateBlogHandler } from "./routes/handlers/updateBlogsHandler";
import { deleteBlogHandler } from "./routes/handlers/deleteBlogHandler";
import { blogValidators } from "../core/middlewares/blogValidation/blog-input-dto.validation";
import { superAdminGuardMiddleware } from "../core/middlewares/validation/super-admin.guard-middleware";
import { idValidation } from "../core/middlewares/validation/params-id.validation-middleware";
import { getPostsByBlogId } from "./routes/handlers/getPostsByBlogIdHandler";
import { createPostByBlogId } from "./routes/handlers/createPostByBlogIdHandler";
import { createPostByBlogIdValidators } from "../core/middlewares/postValidation/post-input-dto.validation";
import { paginationAndSortingValidation } from "../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
export const blogsRouter = Router();

blogsRouter
  .get("/", getAllBlogsHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    blogValidators,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .get("/:id/posts", idValidation, getPostsByBlogId)

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    createPostByBlogIdValidators,
    inputValidationResultMiddleware,
    createPostByBlogId,
  )

  .get("/:id", idValidation, inputValidationResultMiddleware, findBlogHandler)

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogValidators,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
