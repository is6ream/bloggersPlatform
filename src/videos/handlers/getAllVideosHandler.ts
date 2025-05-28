import { db } from "../../db";
import { Request, Response } from "express";

export function getAllVideosHandler(req: Request, res: Response) {
  const videos = db.videos;
  res.status(200).json(videos);
}
