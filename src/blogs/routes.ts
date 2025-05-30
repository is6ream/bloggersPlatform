import { Router } from "express";
import { VideosHandlers } from "./handlers/videosHandler";
import { inputValidationResultMiddleware } from "./validation/input-validation-result.middleware";
import { idValidation } from "./validation/params-id.validation-middleware";
import { getAllVideosHandler } from "./handlers/getAllBlogsHandler";
import { createVideoHandler } from "./handlers/createBlogHandler";
import { findVideoHandler } from "./handlers/findBlogHandler";
import { updateVideoHandler } from "./handlers/updateBlogsHandler";
import { deleteVideoHandler } from "./handlers/deleteBlogHandler";
export const videosRouter = Router();

videosRouter
  .get("/", getAllVideosHandler)
  .post("/", createVideoHandler)
  .get("/:id", idValidation, inputValidationResultMiddleware, findVideoHandler)
  .put("/:id", idValidation, updateVideoHandler) //подключить валдиацию dto
  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    deleteVideoHandler,
  )
  .delete("/testing/all-data", deleteVideoHandler);
