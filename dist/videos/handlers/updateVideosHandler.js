"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoHandler = updateVideoHandler;
const db_1 = require("../../db");
function updateVideoHandler(req, res) {
  const findVideo = db_1.db.videos.find((v) => v.id === +req.params.id);
  if (!findVideo) {
    res.status(404).send({ message: "Video not found!" });
    return;
  }
  findVideo.title = req.body.title || findVideo.title;
  findVideo.author = req.body.author || findVideo.author;
  findVideo.canBeDownloaded =
    req.body.canBeDownloaded || findVideo.canBeDownloaded;
  findVideo.minAgeRestriction =
    req.body.minAgeRestriction || findVideo.minAgeRestriction;
  findVideo.publicationDate =
    req.body.publicationDate || findVideo.publicationDate;
  findVideo.availableResolutions =
    req.body.availableResolutions || findVideo.availableResolutions;
  res.status(204).send();
}
