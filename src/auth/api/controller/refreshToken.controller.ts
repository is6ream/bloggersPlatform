import { IdType } from "../../../core/types/authorization/id";
import { RequestWithUserIdAndCookies } from "../../../core/types/common/requests";
import { Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { authService } from "../../application/auth.service";
export async function refreshTokenController(
  req: RequestWithUserIdAndCookies<IdType>,
  res: Response,
) {
  try {
    const tokens = await authService.updateTokens(
      req.user!.id,
      req.cookies.refreshToken!,
    );
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
