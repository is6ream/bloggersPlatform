import { Request, Response } from "express";
import { createInputValidation } from "../validation/create-update.validation";
import { videoRepository } from "../repositories/video.repository";

export function createVideoHandler(req: Request, res: Response) {
  const errors = createInputValidation(req.body);

  if (errors.errorsMessages.length) {
    res.status(400).json(errors);
    return;
  }
  let newVideo = req.body;
  videoRepository.create(newVideo);
  res.status(201).send(newVideo);
}
