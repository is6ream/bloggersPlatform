import { Router } from "express";
import { VideosHandlers } from "./handlers/VideosHandler";

export const videosRouter = Router();

videosRouter
    .get('/', VideosHandlers.getAllVideos)
    .post('/', VideosHandlers.createVideo)
    .get('/:id', VideosHandlers.findVideo)
    .put('/:id', VideosHandlers.updateVideo)
    .delete('/:id', VideosHandlers.deleteVideo)

