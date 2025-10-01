import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { sessionQueryRepository } from "../../infrastructure/sessionQueryRepository";

export const getAllDevicesHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const sessions = await sessionQueryRepository.getAllSessions(userId);
  res.status(HttpStatus.Ok).send(sessions);
};
