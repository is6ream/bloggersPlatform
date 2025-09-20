import { Response } from "express";
import { RequestWithParams } from "../../../core/types/common/requests";
import { sessionService } from "../../domain/sessionService";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/http-statuses";
import { DeviceIdType } from "../../types/deviceIdType";

export const deleteSessionByDeviceIdHandler = async (
  req: RequestWithParams<DeviceIdType>,
  res: Response,
) => {
  try {
    const deviceId = req.params.deviceId;
    const result = await sessionService.deleteById(deviceId);
    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  } catch (err: unknown) {
    console.error(err);
    return res.sendStatus(HttpStatus.InternalServerError);
  }
};
