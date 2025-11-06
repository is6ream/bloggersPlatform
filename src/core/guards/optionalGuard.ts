import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../auth/adapters/jwt.service";

export const optionalGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    next();
    return;
  }
  const [token] = req.headers.authorization.split(" ");
  const payload = await jwtService.verifyToken(token);
  if (!payload) {
    next();
    return;
  }
  const { userId } = payload;
  req.userId = userId;
  next();
  return;
};
