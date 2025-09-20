import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { sessionQueryRepository } from "../../infrastructure/sessionQueryRepository";

export const getAllDevicesHandler = async (req: Request, res: Response) => {
  const sessions = await sessionQueryRepository.getAllSessions();
  res.status(HttpStatus.Ok).send(sessions);
};
