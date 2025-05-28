import { Router } from "express";
import { VideosHandlers } from "./handlers/videosHandler";

export const videosRouter = Router();

videosRouter
  .get("/", VideosHandlers.getAllVideos)
  .post("/", VideosHandlers.createVideo)
  .get("/:id", VideosHandlers.findVideo)
  .put("/:id", VideosHandlers.updateVideo)
  .delete("/:id", VideosHandlers.deleteVideo)
  .delete("/testing/all-data", VideosHandlers.deleteAllData);
