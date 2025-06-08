import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getAllBlogsHandler } from "../handlers/getAllBlogsHandler";
import { createBlogHandler } from "../handlers/createBlogHandler";
import { findBlogHandler } from "../handlers/findBlogHandler";
import { updateBlogHandler } from "../handlers/updateBlogsHandler";
import { deleteBlogHandler } from "../handlers/deleteBlogHandler";
import { deleteAllBlogs } from "../handlers/deleteAllBlogsHandler";
import { blogValidators } from "../../core/middlewares/blogValidation/blog-input-dto.validation";
import { superAdminGuardMiddleware } from "../../core/middlewares/validation/super-admin.guard-middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
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
  )

  .delete("/all-data", deleteAllBlogs);
