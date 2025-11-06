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
  const [authType, token] = req.headers.authorization.split(" ");
  console.log(token, "TOKEN");
  const payload = await jwtService.verifyToken(token);
  if (!payload) {
    next();
    return;
  }
  const { userId } = payload;
  console.log(userId, "GUARD");
  req.userId = userId;
  next();
  return;
};
//создаем коммент
//лайкаем коммент первый пользователем
//запрашиваем коммент вторым пользователем
//дизлайкаем комментарий вторым пользователем
//запрашиваем первым пользователем
