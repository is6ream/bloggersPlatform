import { Request, Response } from "express";
import { VideoType } from "../../core/video-types";
import { db } from "../../db";

export function deleteVideoHandler(req: Request, res: Response) {
  const id = +req.params.id;
  const findVideo: VideoType | undefined = db.videos.find((v) => v.id === id);

  if (findVideo) {
    res.status(404).json({ message: "Video not found!" });
  }
  db.videos = db.videos.filter((v) => v.id !== id);
  res.status(204).send();
}
