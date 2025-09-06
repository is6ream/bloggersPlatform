import { NextFunction, Response } from "express";
import { RequestWithRefreshToken } from "../controller/refreshToken.controller";
import { HttpStatus } from "../../core/http-statuses";
import { tokenBlackListedRepository } from "../infrastructure/tokenBlackListedRepository";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/authorization/id";

export const refreshTokenGuard = async (
  req: RequestWithRefreshToken,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const isBlackListed =
    await tokenBlackListedRepository.isBlackListed(refreshToken);

  if (isBlackListed) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = await jwtService.verifyToken(refreshToken);
  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  req.user = { id: payload.userId } as IdType;
  next();
};
