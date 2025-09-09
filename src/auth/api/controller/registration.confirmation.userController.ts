import { Response } from "express";
import { RequestWithBody } from "../../core/types/common/requests";
import { authService } from "../application/auth.service";
import { ResultStatus } from "../../core/result/resultCode";
import { HttpStatus } from "../../core/http-statuses";

export type EmailConfirmCode = {
  code: string;
};

export async function confirmRegisterUserController(
  req: RequestWithBody<EmailConfirmCode>,
  res: Response,
) {
  const { code } = req.body;
  const result = await authService.confirmEmail(code);

  if (result.status !== ResultStatus.Success) {
    res.status(HttpStatus.BadRequest).send(result.extensions);
    return;
  }
  res.status(HttpStatus.NoContent).send();

  res.sendStatus(HttpStatus.NoContent);
}
