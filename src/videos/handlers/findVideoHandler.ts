import { Request, Response } from "express";
import { db } from "../../db";
import { VideoType } from "../../core/video-types";

export function findVideoHandler(req: Request, res: Response) {
  const findVideo: VideoType | undefined = db.videos.find(
    (v) => v.id === +req.params.id,
  );
  if (!findVideo) {
    res.status(404).send({ message: "Video not found!" });
  }
  res.status(200).send(findVideo);
}
