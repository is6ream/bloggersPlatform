import { VideoType } from "../../core/video-types";
import { db } from "../../db";
import { Request, Response } from "express";

export function updateVideoHandler(req: Request, res: Response) {
  const findVideo: VideoType | undefined = db.videos.find(
    (v) => v.id === +req.params.id,
  );
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
