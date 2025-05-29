import { Router } from "express";
import { VideosHandlers } from "./handlers/videosHandler";
import { inputValidationResultMiddleware } from "./validation/input-validation-result.middleware";
import { idValidation } from "./validation/params-id.validation-middleware";
import { getAllVideosHandler } from "./handlers/getAllVideosHandler";
import { createVideoHandler } from "./handlers/createVideoHandler";
import { findVideoHandler } from "./handlers/findVideoHandler";
import { updateVideoHandler } from "./handlers/updateVideosHandler";
import { deleteVideoHandler } from "./handlers/deleteVideoHandler";
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
