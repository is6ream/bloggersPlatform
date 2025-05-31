import { Router } from "express";
import { inputValidationResultMiddleware } from "./validation/input-validation-result.middleware";
import { idValidation } from "./validation/params-id.validation-middleware";
import { getAllBlogsHandler } from "./handlers/getAllBlogsHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { findBlogHandler } from "./handlers/findBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogsHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
export const videosRouter = Router();

videosRouter
  .get("/", getAllBlogsHandler)
  .post("/", createBlogHandler)
  .get("/:id", idValidation, inputValidationResultMiddleware, findBlogHandler)
  .put("/:id", idValidation, updateBlogHandler) //подключить валдиацию dto

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )

  .delete("/testing/all-data");
