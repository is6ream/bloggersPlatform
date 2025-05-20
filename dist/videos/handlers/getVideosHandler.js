"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosHandlers = void 0;
const db_1 = require("../../db");
exports.getVideosHandlers = {
    getAllVideos: ((req, res) => {
        const videos = db_1.db.videos;
        res
            .status(200)
            .json(videos);
    })
};
