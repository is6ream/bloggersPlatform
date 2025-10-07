import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogController } from "./controller/blogsController";
import { blogValidators } from "../../core/middlewares/blogValidation/blog-input-dto.validation";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";

import { createPostByBlogIdValidators } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { PostSortField } from "../../posts/input/post-sort-field";

export const blogsRouter = Router();

blogsRouter
  .get(
    "/",
    paginationAndSortingValidation(BlogSortField),
    blogController.getAllBlogs.bind(blogController),
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    blogValidators,
    inputValidationResultMiddleware,
    blogController.createBlog.bind(blogController),
  )
  .get(
    "/:id/posts",
    paginationAndSortingValidation(PostSortField),
    idValidation,
    blogController.getPostsByBlogId.bind(blogController),
  )

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    createPostByBlogIdValidators,
    inputValidationResultMiddleware,
    blogController.createPostByBlogId.bind(blogController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    blogController.findBlog.bind(blogController),
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogValidators,
    inputValidationResultMiddleware,
    blogController.updateBlog.bind(blogController),
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogController.deleteBlog.bind(blogController),
  );
