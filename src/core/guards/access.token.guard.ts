import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../auth/adapters/jwt.service";
import { IdType } from "../types/authorization/id";
import { HttpStatus } from "../http-statuses";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  console.log(req.headers.authorization);

  const [authType, token] = req.headers.authorization.split(" ");
  console.log(authType, authType !== "Bearer");

  if (authType !== "Bearer") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const payload = await jwtService.verifyToken(token);
  console.log(payload);
  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;
    next();
    return;
  }
  res.sendStatus(HttpStatus.Unauthorized);
};
