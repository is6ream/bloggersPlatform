import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../adapters/jwt.service";
import { IdType } from "../../../core/types/authorization/id";
import { HttpStatus } from "../../../core/http-statuses";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization)
    return res.sendStatus(HttpStatus.Unauthorized);

  const [authType, token] = req.headers.authorization.split(" ")[1];

  if (authType !== "Bearer") return res.sendStatus(HttpStatus.Unauthorized);

  const payload = await jwtService.verifyToken(token);
  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;
    //вот здесь нужно посмотреть
    next();
  }
  res.sendStatus(HttpStatus.Unauthorized);

  return;
};
