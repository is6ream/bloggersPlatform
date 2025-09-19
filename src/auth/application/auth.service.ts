import { jwtService } from "./../adapters/jwt.service";
import { UserDB } from "../../users/input/create-user-dto";
import { usersRepository } from "../../users/repositories/users.repository";
import { ResultStatus } from "../../core/result/resultCode";
import { RegistrationResult, Result } from "../../core/result/result.type";
import { bcryptService } from "../adapters/bcrypt.service";
import { User } from "../../users/constructors/user.entity";
import { emailAdapter } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/email.example";
import { UserDbDto } from "../../users/types/user-types";
import { randomUUID } from "crypto";
import { tokenBlackListedRepository } from "../infrastructure/tokenBlackListedRepository";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
} from "../../core/result/handleResult";
import { SessionDto } from "../../securityDevices/types/sessionDataTypes";
import { SessionDataType } from "../types/input/login-input.models";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import jwt from "jsonwebtoken";
import { appConfig } from "../../core/config/config";
import { RefreshTokenPayload } from "../types/auth.types";

export const authService = {
  async registerUser(
    login: string,
    password: string,
    email: string,
  ): Promise<RegistrationResult<User | null> | undefined> {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email); //проверяем, существует ли пользователь уже в системе
    if (user?.login === login) {
      //если логин юзера равен логину, который поступил, 404
      return handleBadRequestResult("user already registered", "login");
    } else if (user?.email === email) {
      return handleBadRequestResult("user already registered", "email");
    }
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);
    await usersRepository.create(newUser);

    try {
      await emailAdapter.sendEmail(
        newUser.email,
        newUser.emailConfirmation!.confirmationCode,
        emailExamples.registrationEmail,
      );

      return handleSuccessResult(newUser);
    } catch (err: unknown) {
      console.error(err);
    }
  },
  async confirmEmail(code: string): Promise<RegistrationResult<null>> {
    const user: UserDbDto | null =
      await usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return handleBadRequestResult(
        "confirmation code is incorrect",
        "confirmation code",
      );
    }
    if (user?.emailConfirmation.confirmationCode !== code) {
      return handleBadRequestResult(
        "confirmation code is incorrect",
        "confirmation code",
      );
    }
    if (user.emailConfirmation?.expirationDate < new Date()) {
      return handleBadRequestResult("code is expired", "confirmation code");
    }
    if (user.emailConfirmation.isConfirmed) {
      return handleBadRequestResult("code has already been applied", "code");
    }

    await usersRepository.update(user.id);
    return handleSuccessResult();
  },
  async resendingEmail(
    email: string,
  ): Promise<RegistrationResult<null> | undefined> {
    const user = await usersRepository.isUserExistByEmailOrLogin(email);
    if (!user) {
      return handleBadRequestResult("user does not exist", "email");
    }
    if (user.emailConfirmation?.isConfirmed === true) {
      return handleBadRequestResult("email already confirmed", "email");
    }

    const newConfimationCode = randomUUID();
    try {
      await emailAdapter.sendEmail(
        user.email,
        newConfimationCode,
        emailExamples.registrationEmail,
      );

      return handleSuccessResult();
    } catch (err: unknown) {
      console.error(err);
      return;
    }
  },
  async loginUser(
    sessionDto: SessionDto,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(
      sessionDto.loginOrEmail,
      sessionDto.password,
    );
    if (result.status !== ResultStatus.Success) {
      //результат проверки credentials
      const loginOrEmailError:
        | { message: string; field: string | null }
        | undefined = result.extensions!.errorsMessages.find(
        (error) => error.field === "loginOrEmail", //ищем ошибку по полю loginOrEmail
      );
      const passwordError:
        | {
            message: string;
            field: string | null;
          }
        | undefined = result.extensions!.errorsMessages.find(
        (error) => error.field === "password", //ищем ошибку по полю password
      );

      if (loginOrEmailError) {
        return handleBadRequestResult("wrong credentials", "loginOrEmail");
      } else {
        return handleBadRequestResult("wrong credentials", "password");
      }
    }
    const accessToken = await jwtService.createAccessToken(result.data!.id!);
    const deviceId = randomUUID(); //формируем deviceId
    const refreshToken = await jwtService.createRefreshToken(
      result.data!.id!,
      deviceId,
    );

    const payloadOfRefreshToken = await jwtService.verifyToken(refreshToken);
    const sessionData: SessionDataType = {
      userId: result.data!.id!, //c рейт лимит создать отдельную коллекцию и реализовать через middleware
      deviceId: deviceId,
      iat: new Date(payloadOfRefreshToken!.iat * 1000).toString(), //приводим к читаемой дате,
      deviceName: sessionDto.deviceName,
      ip: sessionDto.ip,
    };
    await sessionsRepository.createSession(sessionData); //передаем в DAL данные о сессии и сохраняем их в бд
    return handleSuccessResult({ accessToken, refreshToken }); //
  },
  async logout(oldToken: string): Promise<Result<null>> {
    await tokenBlackListedRepository.addToBlackList(oldToken);
    return handleSuccessResult();
  },
  async updateTokens(
    oldToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const payload = await jwtService.decodeToken(oldToken);
    const payloadIat = new Date(payload.iat * 1000).toString();
    const result = await sessionsRepository.updateSessions(
      payloadIat,
      payload.deviceId,
    );
    if (!result) {
      throw Error("token is not updated");
    }
    // await tokenBlackListedRepository.addToBlackList(oldToken); //мы должны заменить эту строку обновлением сессии
    const accessToken = await jwtService.createAccessToken(payload.userId);
    const refreshToken = await jwtService.createRefreshToken(
      payload.userId,
      payload.deviceId,
    );
    return handleSuccessResult({ accessToken, refreshToken });
  },
  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserDB | null>> {
    const user = await usersRepository.isUserExistByEmailOrLogin(loginOrEmail);
    if (!user) {
      return handleNotFoundResult("not found", "loginOrEmail");
    }
    const isPasscorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPasscorrect) {
      return handleBadRequestResult("password", "wrong password");
    }
    return handleSuccessResult(user);
  },
};
