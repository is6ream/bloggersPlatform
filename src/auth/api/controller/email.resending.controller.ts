import { Response } from "express";
import { RequestWithBody } from "../../core/types/common/requests";
import { ResendingBodyType } from "../types/auth.types";
import { authService } from "../application/auth.service";
import { ResultStatus } from "../../core/result/resultCode";
import { HttpStatus } from "../../core/http-statuses";
export async function emailResendingController(
  req: RequestWithBody<ResendingBodyType>,
  res: Response,
) {
  const { email } = req.body;

  const result = await authService.resendingEmail(email);
  if (result === undefined) {
    res.sendStatus(HttpStatus.InternalServerError);
  }

  if (result!.status !== ResultStatus.Success) {
    res.status(HttpStatus.BadRequest).send(result!.extensions);
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
  return;
}
