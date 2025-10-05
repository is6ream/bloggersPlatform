import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithBody } from "../../../core/types/common/requests";
import { AuthCredentials } from "../../types/input/login-input.models";
import { SessionDto } from "../../../securityDevices/types/sessionDataTypes";
import { ResendingBodyType } from "../../types/auth.types";
import { CurrentUser } from "../../../users/types/user-types";
import { usersQueryRepository } from "../../../users/infrastructure/user.query.repository";
import { CreateUserDto } from "../../types/auth.types";
import { EmailConfirmCode } from "../../types/emailConfirmCode";

class AuthUserController {
  async loginUser(req: RequestWithBody<AuthCredentials>, res: Response) {
    const sessionDto: SessionDto = {
      deviceName: req.headers["user-agent"] || "unknown",
      ip: req.ip || "127.0.0.1",
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
    };
    try {
      const result = await authService.loginUser(sessionDto);
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
      console.log(accessToken, "accessToken in API");
      res.status(HttpStatus.Ok).send({ accessToken: accessToken });
      return;
    } catch (error: unknown) {
      console.log(error);
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }
  }

  async emailResending(req: RequestWithBody<ResendingBodyType>, res: Response) {
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

  async getInfoAboutUser(req: Request, res: Response) {
    if (!req.userId) res.sendStatus(HttpStatus.Unauthorized);
    const userId = req.userId;

    const me: CurrentUser | null = await usersQueryRepository.findById(userId!);

    res.status(HttpStatus.Ok).send(me);
  }

  async logout(req: Request, res: Response) {
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

  async refreshToken(req: Request, res: Response) {
    try {
      //получаем id для обновления
      const userId = req.userId;
      const deviceId = req.deviceId;
      const tokens = await authService.refreshSessions(userId, deviceId);

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
      (console.log(err), res.sendStatus(HttpStatus.InternalServerError));
      return;
    }
  }

  async confirmRegisterUser(
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

  async registrationUser(req: RequestWithBody<CreateUserDto>, res: Response) {
    const { login, email, password } = req.body;
    const result = await authService.registerUser(login, password, email);
    if (result === undefined) {
      res.sendStatus(HttpStatus.InternalServerError);
    }
    if (result!.status !== ResultStatus.Success) {
      console.log(result?.extensions, "extensions check in register API");
      res.status(HttpStatus.BadRequest).send(result!.extensions);
      return;
    }
    res.sendStatus(HttpStatus.NoContent);

    return;
  }
}

export const authUserController = new AuthUserController();
