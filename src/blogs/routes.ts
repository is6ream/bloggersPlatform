import { Router } from "express";
import { inputValidationResultMiddleware } from "../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../core/middlewares/validation/params-id.validation-middleware";
import { getAllBlogsHandler } from "./handlers/getAllBlogsHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { findBlogHandler } from "./handlers/findBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogsHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { deleteAllBlogs } from "./handlers/deleteAllBlogsHandler";
import { blogValidators } from "../core/middlewares/blog-input-dto.validation";
export const blogsRouter = Router();

blogsRouter
  .get("/", getAllBlogsHandler)
  .post("/", blogValidators, inputValidationResultMiddleware, createBlogHandler)
  .get("/:id", idValidation, inputValidationResultMiddleware, findBlogHandler)

  .put(
    "/:id",
    idValidation,
    blogValidators,
    inputValidationResultMiddleware,
    updateBlogHandler,
  ) //подключить валдиацию dto

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )

  .delete("/testing/all-data", deleteAllBlogs);
