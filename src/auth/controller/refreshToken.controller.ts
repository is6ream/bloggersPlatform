import { Request, Response } from "express";
import { ResultStatus } from "../../core/result/resultCode";

export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}
export async function refreshTokenController(
  req: RequestWithCookies,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken; //здесь мы получаем рефрешТокен, который изначально должен выдать эндпоинт логинизации
  const result = await genNewTokensService(refreshToken);
  if (result.status !== ResultStatus.Success) {
    //где должна осуществляться проверка валдиности токена? Реализовать middleware для проверки refresh, если в куках undefined или null
    //сходить в блек лист либо в вайт лист и проверить, есть ли там рефреш
    //в сервисе я только обновляю
    res.send;
  }
}
//сохраняю как userId
