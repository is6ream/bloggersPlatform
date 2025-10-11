import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogValidators } from "../../core/middlewares/blogValidation/blog-input-dto.validation";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { blogsController, blogsQueryController } from "../../compositionRoot";
import { createPostByBlogIdValidators } from "../../core/middlewares/postValidation/post-input-dto.validation";
import { paginationAndSortingValidation } from "../../core/middlewares/query-pagination-sorting/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { PostSortField } from "../../posts/input/post-sort-field";

export const blogsRouter = Router();

blogsRouter
  .get(
    "/",
    paginationAndSortingValidation(BlogSortField),
    blogsQueryController.getAllBlogs.bind(blogsQueryController),
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    blogValidators,
    inputValidationResultMiddleware,
    blogsController.createBlog.bind(blogsController),
  )
  .get(
    "/:id/posts",
    paginationAndSortingValidation(PostSortField),
    idValidation,
    blogsQueryController.getPostsByBlogId.bind(blogsQueryController),
  )

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    createPostByBlogIdValidators,
    inputValidationResultMiddleware,
    blogsController.createPostByBlogId.bind(blogsController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    blogsQueryController.findBlog.bind(blogsQueryController),
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogValidators,
    inputValidationResultMiddleware,
    blogsController.updateBlog.bind(blogsController),
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController),
  );
