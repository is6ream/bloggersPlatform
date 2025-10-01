import { HttpStatus } from "../../../core/http-statuses";
import { authService } from "../../application/auth.service";
import { Request, Response } from "express";
export async function logoutController(req: Request, res: Response) {
  const deviceId = req.deviceId;
  await authService.logout(deviceId!);
  res.sendStatus(HttpStatus.NoContent);
}
