import { Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithBody } from "../../../core/types/common/requests";
import { AuthCredentials } from "../../types/input/login-input.models";

export type SessionDto = {
  deviceName: string;
  ip: string;
  loginOrEmail: string;
  password: string;
};

export async function loginUserController(
  req: RequestWithBody<AuthCredentials>,
  res: Response,
) {
  const sessionDto: SessionDto = {
    deviceName: req.headers["user-agent"] || "unknown",
    ip: req.ip || "127.0.0.1",
    loginOrEmail: req.body.loginOrEmail,
    password: req.body.password,
  };
  try {
    const result = await authService.loginUser(sessionDto);

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
      return;
    }
    const refreshToken = result.data?.refreshToken;
    const accessToken = result.data?.accessToken;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.Ok).send({ accessToken: accessToken });
    return;
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }
}
