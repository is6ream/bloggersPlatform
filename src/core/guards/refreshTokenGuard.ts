import { RequestWithCookies } from "../types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../http-statuses";
import { jwtService } from "../../auth/adapters/jwt.service";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { RefreshTokenPayload } from "../../auth/types/auth.types";

export const refreshTokenGuard = async (
  req: RequestWithCookies,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
      console.error("Refresh token in cookies not found");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const payload: RefreshTokenPayload | null =
    await jwtService.verifyToken(refreshToken);
  if (!payload) {
      console.log("Refresh token not verified");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    //проверяем - есть ли активный пользователь на данный момент
    new Date(payload.iat * 1000).toISOString(),
  );
  console.log(activeSessionCheck, "check active session");
  if (!activeSessionCheck) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const { deviceId, userId } = payload; //достаем из payload id и передаем их далее
  req.deviceId = deviceId;
  req.userId = userId;
  next();
};
