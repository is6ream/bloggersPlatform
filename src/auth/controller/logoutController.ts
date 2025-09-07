import { HttpStatus } from "../../core/http-statuses";
import { RequestWithCookies } from "../../core/types/common/requests";
import { authService } from "../application/auth.service";
import { Response } from "express";
export async function logoutController(req: RequestWithCookies, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(refreshToken!);
  res.sendStatus(HttpStatus.NoContent);
}
