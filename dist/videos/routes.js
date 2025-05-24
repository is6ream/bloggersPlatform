"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const videosHandler_1 = require("./handlers/videosHandler");
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter
    .get('/', videosHandler_1.VideosHandlers.getAllVideos)
    .post('/', videosHandler_1.VideosHandlers.createVideo)
    .get('/:id', videosHandler_1.VideosHandlers.findVideo)
    .put('/:id', videosHandler_1.VideosHandlers.updateVideo)
    .delete('/:id', videosHandler_1.VideosHandlers.deleteVideo)
    .delete('/testing/all-data', videosHandler_1.VideosHandlers.deleteAllData);
