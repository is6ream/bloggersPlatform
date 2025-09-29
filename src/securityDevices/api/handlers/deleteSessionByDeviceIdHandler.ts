import { Response, Request } from "express";
import { sessionService } from "../../domain/sessionService";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/http-statuses";

export const deleteSessionByDeviceIdHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const deviceIdFromParams = req.params.id;
    const deviceIdFromGuard = req.deviceId;
    const userId = req.userId;
    console.log(deviceIdFromParams, ": params dId");
    console.log(deviceIdFromGuard, ": guard dId");
    const result = await sessionService.deleteByDeviceId(
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
};
