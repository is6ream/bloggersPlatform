import { Request, Response } from "express";
import { authService } from "../application/auth.service";
import { HttpStatus } from "../../core/http-statuses";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";

export async function loginUserController(req: Request, res: Response) {
  try {
    const result = await authService.loginUser(
      req.body.loginOrEmail,
      req.body.password,
    );
    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }
    res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
    const refreshToken = result.data!.refreshToken;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
