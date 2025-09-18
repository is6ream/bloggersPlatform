import { IdType } from "../../../core/types/authorization/id";
import { RequestWithUserIdAndCookies } from "../../../core/types/common/requests";
import { Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { authService } from "../../application/auth.service";
import { jwtService } from "../../adapters/jwt.service";
export async function refreshTokenController(
  req: RequestWithUserIdAndCookies<IdType>,
  res: Response,
) {
  try {
    const payload = await jwtService.decodeToken(req.cookies.refreshToken); /*{
  userId: '0344152f-1fd5-445a-a65c-bcd0231149d6', эта два поля передаются неверно
  deviceId: '68cc38f9ff1258ffe582d74a',
  iat: 1758215129,
  exp: 1758215249
} */
    console.log(payload, "RT CHECK");
    const tokens = await authService.updateTokens(req.cookies.refreshToken!);

    if (!tokens) {
      res.sendStatus(HttpStatus.Unauthorized);
    }
    res.cookie("refreshToken", tokens.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(HttpStatus.Ok).send({
      accessToken: tokens.data!.accessToken,
    });
    return;
  } catch (err: unknown) {
    (console.log(err), res.sendStatus(HttpStatus.InternalServerError));
    return;
  }
}
