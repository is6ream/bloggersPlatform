import { db } from "../../db";
import { Request, Response } from "express";
import { createInputValidation } from "../validation/create-update.validation";
import { VideoType } from "../../core/video-types";

export function createVideoHandler(req: Request, res: Response) {
  const errors = createInputValidation(req.body);

  if (errors.errorsMessages.length) {
    res.status(400).json(errors);
    return;
  }
  const newVideo: VideoType = {
    id: Math.floor(Date.now() + Math.random()),
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: req.body.availableResolutions,
  };

  db.videos.push(newVideo);
  res.status(201).send(newVideo);
}
