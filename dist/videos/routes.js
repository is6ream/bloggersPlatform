"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const VideosHandler_1 = require("./handlers/VideosHandler");
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter
    .get('/', VideosHandler_1.VideosHandlers.getAllVideos)
    .post('/', VideosHandler_1.VideosHandlers.createVideo)
    .get('/:id', VideosHandler_1.VideosHandlers.findVideo)
    .put('/:id', VideosHandler_1.VideosHandlers.updateVideo)
    .delete('/:id', VideosHandler_1.VideosHandlers.deleteVideo);
