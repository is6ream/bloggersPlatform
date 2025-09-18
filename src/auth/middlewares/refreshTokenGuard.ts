import { RequestWithUserIdAndCookies } from "./../../core/types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/authorization/id";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";

export const refreshTokenGuard = async (
  req: RequestWithUserIdAndCookies<IdType>,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log(refreshToken, "Rt check in guard");
  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const payload = (await jwtService.verifyToken(refreshToken)) as unknown as {
    //приводим payload к явному типу для доступа к полям
    userId: string;
    deviceId: string;
    iat: number;
    exp: string;
  };
  if (!payload) {
    console.log("verify error check");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    //проверяем - есть ли активный пользователь на данный момент
    payload.iat,
  );
  if (!activeSessionCheck) {
    console.log("active session error check");
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  req.user = { id: payload.userId } as IdType;
  next();
};
