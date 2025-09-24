import { RequestWithBody } from "../../../core/types/common/requests";
import { authService } from "../../application/auth.service";
import { CreateUserDto } from "../../types/auth.types";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/http-statuses";
import { Response } from "express";

export async function registrationUserController(
  req: RequestWithBody<CreateUserDto>,
  res: Response,
) {
  const { login, email, password } = req.body;

  const result = await authService.registerUser(login, password, email);
  console.log(result?.extensions, "EXTENSIONS CHECK IN API");
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
