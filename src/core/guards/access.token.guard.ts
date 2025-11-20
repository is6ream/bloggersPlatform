import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../auth/adapters/jwt.service";
import { HttpStatus } from "../http-statuses";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    console.log("Authorization header");
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const [authType, token] = req.headers.authorization.split(" ");
  if (authType !== "Bearer") {
    console.log("!Bearer");
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const payload = await jwtService.verifyToken(token);
  console.log(payload);
  if (payload) {
    const { userId } = payload;
    req.userId = userId;
    next();
    return;
  }
  console.log("другой повод");
  res.sendStatus(HttpStatus.Unauthorized);
  return;
};
