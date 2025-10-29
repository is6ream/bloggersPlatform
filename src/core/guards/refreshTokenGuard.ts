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
  //check
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
  console.log(new Date(payload.iat).toISOString(), "iat check in rt guard"); //ОСТАНОВИЛСЯ ТУТ
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    //1970-01-21T09:21:44.397Z почему iat прилетает в таком формате?
    //проверяем - есть ли активный пользователь на данный момент
    payload.iat.toString(),
  );
  console.log(activeSessionCheck, "check active session"); //тут false, значит при логине сессия не записвыается
  if (!activeSessionCheck) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const { deviceId, userId } = payload; //достаем из payload id и передаем их далее
  req.deviceId = deviceId;
  req.userId = userId;
  next();
};
