import { RequestWithCookies } from "../types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../http-statuses";
import { jwtService } from "../../auth/adapters/jwt.service";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { RefreshTokenPayload } from "../../auth/types/auth.types";
import { DeviceIdType } from "../types/authorization/id";

export const refreshTokenGuard = async (
  req: RequestWithCookies,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    console.log("is token exist in cookies?");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const payload: RefreshTokenPayload | null =
    await jwtService.verifyToken(refreshToken);
  if (!payload) {
    console.log("is token verify");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    //проверяем - есть ли активный пользователь на данный момент
    new Date(payload.iat * 1000).toISOString(),
  );
  if (!activeSessionCheck) {
    console.log("session is not exits by iat");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const { deviceId } = payload;
  req.deviceId = { id: deviceId } as DeviceIdType;
  next();
  return;
};
