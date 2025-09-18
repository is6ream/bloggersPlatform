import { RequestWithUserIdAndCookies } from "./../../core/types/common/requests";
import { NextFunction, Response } from "express";
import { HttpStatus } from "../../core/http-statuses";
import { tokenBlackListedRepository } from "../infrastructure/tokenBlackListedRepository";
import { jwtService } from "../adapters/jwt.service";
import { IdType } from "../../core/types/authorization/id";
import {appConfig} from "../../core/config/config";

export const refreshTokenGuard = async (
  req: RequestWithUserIdAndCookies<IdType>,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  // const isBlackListed =
  //   await tokenBlackListedRepository.isBlackListed(refreshToken);
  // if (isBlackListed) {
  //   return res.sendStatus(HttpStatus.Unauthorized);
  // }
  const payload = await jwtService.verifyToken(refreshToken);
  console.log(payload, "payload check ");
  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  req.user = { id: payload.userId } as IdType;
  next();
};
