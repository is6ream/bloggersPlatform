import { Request, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { sessionService } from "../domain/sessionService";

export const deleteAllDeviceSessionsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    await sessionService.deleteAllSessions();
  } catch (err: unknown) {
    console.error(err);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
