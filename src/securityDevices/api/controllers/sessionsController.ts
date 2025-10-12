import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { SessionService } from "../../domain/sessionService";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { injectable } from "inversify";

@injectable()
export class SessionsController {
  constructor(private sessionsService: SessionService) {}
  async deleteAllDeviceSessions(req: Request, res: Response) {
    try {
      const deviceId = req.deviceId;
      const userId = req.userId;
      if (!userId || !deviceId) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }
      await this.sessionsService.deleteAllDeviceSessions(userId, deviceId);
      return res.sendStatus(HttpStatus.NoContent);
    } catch (err: unknown) {
      console.error(err);
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteSessionByDeviceId(req: Request, res: Response) {
    try {
      const deviceIdFromParams = req.params.id;
      const deviceIdFromGuard = req.deviceId;
      const userId = req.userId;

      if (!userId || !deviceIdFromGuard) {
        return res.sendStatus(HttpStatus.Forbidden);
      }
      const result = await this.sessionsService.deleteByDeviceId(
        deviceIdFromParams,
        deviceIdFromGuard!,
        userId,
      );
      if (result.status !== ResultStatus.Success) {
        return res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
      }
      return res.sendStatus(HttpStatus.NoContent);
    } catch (err: unknown) {
      console.error(err);
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  }
}
