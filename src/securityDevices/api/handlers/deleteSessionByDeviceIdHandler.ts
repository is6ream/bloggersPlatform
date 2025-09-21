import { Response } from "express";
import { sessionService } from "../../domain/sessionService";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/http-statuses";
import { RequestWithDeviceId } from "../../../core/types/common/requests";
import { DeviceIdType } from "../../../core/types/authorization/id";

export const deleteSessionByDeviceIdHandler = async (
  req: RequestWithDeviceId<DeviceIdType>,
  res: Response,
) => {
  try {
    const deviceIdFromParams = req.params.deviceId;
    const deviceIdFromGuard = req.deviceId;
    const result = await sessionService.deleteByDeviceId(
      deviceIdFromParams,
      deviceIdFromGuard!,
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
