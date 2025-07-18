import { Request, Response } from "express";
import { authService } from "../application/auth.service";
import { HttpStatus } from "../../core/http-statuses";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";

export async function loginUserController(req: Request, res: Response) {
  try {
    const { loginOrEmail, password } = req.body;

    const result = await authService.loginUser(loginOrEmail, password);
    if (result.status === ResultStatus.Unauthorized) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }
    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
