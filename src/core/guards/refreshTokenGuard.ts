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
  console.log(
    new Date(payload.iat * 1000).toISOString(), //нужно привести iat из payload в такой формат - "2025-10-29T02:31:56.677Z"
    "iat check in rt guard",
  );
  const tokenCreationDate = new Date(payload.iat * 1000).toISOString();


  const activeSessionCheck = await sessionsRepository.isSessionExistByIat(
    tokenCreationDate, payload.deviceId, //почему здесь формируется дата в момент проверки, а не дата, которая была записана в момент формирования сессии???
  );
  //ошибка возникает из-за того, что при авторизации в бд сохраняется одна дата, а при проверке формируется другая
  console.log(activeSessionCheck, "check active session");
  if (!activeSessionCheck) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const { deviceId, userId } = payload; //достаем из payload id и передаем их далее
  req.deviceId = deviceId;
  req.userId = userId;
  next();
};
