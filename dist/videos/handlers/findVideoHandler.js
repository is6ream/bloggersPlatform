"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVideoHandler = findVideoHandler;
const db_1 = require("../../db");
function findVideoHandler(req, res) {
  const findVideo = db_1.db.videos.find((v) => v.id === +req.params.id);
  if (!findVideo) {
    res.status(404).send({ message: "Video not found!" });
  }
  res.status(200).send(findVideo);
}
