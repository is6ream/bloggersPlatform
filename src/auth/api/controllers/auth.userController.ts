import { Request, Response } from "express";
import { AuthService } from "../../domain/auth.service";
import { HttpStatus } from "../../../core/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithBody } from "../../../core/types/common/requests";
import { AuthCredentials } from "../../types/input/login-input.models";
import { SessionDto } from "../../../securityDevices/types/sessionDataTypes";
import { EmailInBodyType, ResendingBodyType } from "../../types/auth.types";
import { EmailConfirmCode } from "../../types/emailConfirmCode";
import { CreateUserDto } from "../../types/auth.types";
import { injectable, inject } from "inversify";
import { PasswordRecoveryModel } from "../../types/recoveryCodeType";

@injectable()
export class AuthUserController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async loginUser(req: RequestWithBody<AuthCredentials>, res: Response) {
    const sessionDto: SessionDto = {
      deviceName: req.headers["user-agent"] || "unknown",
      ip: req.ip || "127.0.0.1",
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };
    try {
      const result = await this.authService.loginUser(sessionDto);
      if (result.status !== ResultStatus.Success) {
        return res
          .status(resultCodeToHttpException(result.status))
          .send(result.extensions);
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

  async logout(req: Request, res: Response) {
    try {
      const deviceId = req.deviceId;
      if (!deviceId) {
        throw Error(`DeviceId ${deviceId} not found`);
      }
      await this.authService.logout(deviceId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (err) {
      console.error(err);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      //получаем id для обновления
      const userId = req.userId;
      const deviceId = req.deviceId;
      const tokens = await this.authService.refreshSessions(userId, deviceId);

      console.log(tokens);
      if (!tokens) {
        res.sendStatus(HttpStatus.Unauthorized);
      }
      res.cookie("refreshToken", tokens.data!.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.Ok).send({
        accessToken: tokens.data!.accessToken,
      });
      return;
    } catch (err: unknown) {
      console.log(err);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async confirmRegisterUser(
    req: RequestWithBody<EmailConfirmCode>,
    res: Response,
  ) {
    const { code } = req.body;
    const result = await this.authService.confirmEmail(code);

    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatus.BadRequest).send(result.extensions);
      return;
    }
    res.status(HttpStatus.NoContent).send();
    return;
  }

  async registrationUser(req: RequestWithBody<CreateUserDto>, res: Response) {
    const { login, email, password } = req.body;
    const result = await this.authService.registerUser(login, password, email);
    if (result === undefined) {
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
    if (result!.status !== ResultStatus.Success) {
      res.status(HttpStatus.BadRequest).send(result!.extensions);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);

    return;
  }

  async emailResending(req: RequestWithBody<ResendingBodyType>, res: Response) {
    const { email } = req.body;

    const result = await this.authService.resendingEmail(email);
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

  async passwordRecovery(req: RequestWithBody<EmailInBodyType>, res: Response) {
    const email = req.body.email;
    await this.authService.requestPasswordReset(email);
    res.sendStatus(HttpStatus.NoContent);
    return;
  }

  async newPassword(
    req: RequestWithBody<PasswordRecoveryModel>,
    res: Response,
  ) {
    const { newPassword, recoveryCode } = req.body;
    const result = await this.authService.resetPassword(
      newPassword,
      recoveryCode,
    );
    if (result.status !== ResultStatus.Success) {
      res.status(HttpStatus.BadRequest).send(result!.extensions);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
    return;
  }
}
