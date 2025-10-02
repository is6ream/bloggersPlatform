import { HttpStatus } from "../../../core/http-statuses";
import { authService } from "../../application/auth.service";
import { Request, Response } from "express";

export async function logoutController(req: Request, res: Response) {
  try {
    const deviceId = req.deviceId;
    if (!deviceId) {
      throw Error(`DeviceId ${deviceId} not found`);
    }
    console.log(deviceId, "deviceId in logout API");
    await authService.logout(deviceId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (err) {
    console.error(err);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
