import { RequestWithDeviceIdAndCookies } from "./../../core/types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { jwtService } from "../adapters/jwt.service";
import { DeviceIdType } from "../../core/types/authorization/id";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { RefreshTokenPayload } from "../types/auth.types";

export const refreshTokenGuard = async (
  req: RequestWithDeviceIdAndCookies<DeviceIdType>,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const payload: RefreshTokenPayload | null =
    await jwtService.verifyToken(refreshToken);
  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    //проверяем - есть ли активный пользователь на данный момент
    new Date(payload.iat * 1000).toISOString(),
  );
  if (!activeSessionCheck) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const { deviceId } = payload;
  req.deviceId = deviceId;
  next();
};
