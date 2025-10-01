import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { sessionService } from "../../domain/sessionService";

export const deleteAllDeviceSessionsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const deviceId = req.deviceId;
    const userId = req.userId;
    if (!userId || !deviceId) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    await sessionService.deleteAllDeviceSessions(userId, deviceId);
    return res.sendStatus(HttpStatus.NoContent);
  } catch (err: unknown) {
    console.error(err);
    return res.sendStatus(HttpStatus.InternalServerError);
  }
};
