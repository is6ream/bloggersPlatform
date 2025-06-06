"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoHandler = deleteVideoHandler;
const db_1 = require("../../db");
function deleteVideoHandler(req, res) {
  const id = +req.params.id;
  const findVideo = db_1.db.videos.find((v) => v.id === id);
  if (findVideo) {
    res.status(404).json({ message: "Video not found!" });
  }
  db_1.db.videos = db_1.db.videos.filter((v) => v.id !== id);
  res.status(204).send();
}
