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
      return;
    }
    const refreshToken = result.data?.refreshToken;
    const accessToken = result.data?.accessToken;
    console.log(refreshToken, "RT", accessToken, "AT");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.Ok).send({ aсcessToken: accessToken });
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
