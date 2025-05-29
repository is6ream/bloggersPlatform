"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVideosHandler = getAllVideosHandler;
const db_1 = require("../../db");
function getAllVideosHandler(req, res) {
    const videos = db_1.db.videos;
    res.status(200).json(videos);
}
