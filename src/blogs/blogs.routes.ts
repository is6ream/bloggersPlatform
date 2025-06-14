import { Router } from "express";
import { inputValidationResultMiddleware } from "../core/middlewares/validation/input-validation-result.middleware";
import { getAllBlogsHandler } from "./routes/handlers/getAllBlogsHandler";
import { createBlogHandler } from "./routes/handlers/createBlogHandler";
import { findBlogHandler } from "./routes/handlers/findBlogHandler";
import { updateBlogHandler } from "./routes/handlers/updateBlogsHandler";
import { deleteBlogHandler } from "./routes/handlers/deleteBlogHandler";
import { deleteAllBlogs } from "./routes/handlers/deleteAllBlogsHandler";
import { blogValidators } from "../core/middlewares/blogValidation/blog-input-dto.validation";
import { superAdminGuardMiddleware } from "../core/middlewares/validation/super-admin.guard-middleware";
import { idValidation } from "../core/middlewares/validation/params-id.validation-middleware";
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

  .post(
    "/",
    superAdminGuardMiddleware,
    blogValidators,
    inputValidationResultMiddleware,
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
