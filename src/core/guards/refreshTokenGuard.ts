import { RequestWithCookies } from "../types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../http-statuses";
import { jwtService } from "../../auth/adapters/jwt.service";
import { RefreshTokenPayload } from "../../auth/types/auth.types";
import { SessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { container } from "../../container";

const sessionsRepository = container.get(SessionsRepository);
export const refreshTokenGuard = async (
  req: RequestWithCookies,
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
  const { deviceId, userId } = payload;
  const tokenCreationDate = new Date(payload.iat * 1000).toISOString();
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    tokenCreationDate,
    deviceId,
  );
  if (!activeSessionCheck) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  req.deviceId = deviceId;
  req.userId = userId;
  next();
};
