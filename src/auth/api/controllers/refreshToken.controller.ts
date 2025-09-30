import { Request, Response } from "express";
import { HttpStatus } from "../../../core/http-statuses";
import { authService } from "../../application/auth.service";
export async function refreshTokenController(req: Request, res: Response) {
  try {
    //получаем id для обновления
    const userId = req.userId;
    const deviceId = req.deviceId;
    const tokens = await authService.refreshSessions(userId, deviceId);

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
