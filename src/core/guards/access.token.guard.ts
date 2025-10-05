import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../auth/adapters/jwt.service";
import { HttpStatus } from "../http-statuses";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const [authType, token] = req.headers.authorization.split(" ");
  if (authType !== "Bearer") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  console.log(token, "token check in guard");
  const payload = await jwtService.verifyToken(token);
  console.log(payload, "payload check");
  if (payload) {
    const { userId } = payload;
    req.userId = userId;
    next();
    return;
  }
  res.sendStatus(HttpStatus.Unauthorized);
};
