import { jwtService } from "../adapters/jwt.service";
import { usersRepository } from "../../users/infrastructure/users.repository";
import { ResultStatus } from "../../core/result/resultCode";
import { RegistrationResult, Result } from "../../core/result/result.type";
import { bcryptService } from "../adapters/bcrypt.service";
import { User } from "../../users/constructors/user.entity";
import { emailAdapter } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/email.example";
import { randomUUID } from "crypto";
import {
  handleBadRequestResult,
  handleNotFoundResult,
  handleSuccessResult,
  handleUnauthorizedFResult,
} from "../../core/result/handleResult";
import { SessionDto } from "../../securityDevices/types/sessionDataTypes";
import { SessionDataType } from "../types/input/login-input.models";
import { sessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { UserOutput } from "../../users/types/user.output";
import { UserDB } from "../../users/input/create-user-dto";
import { AuthError } from "../types/authErrorType";

export class AuthService {
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

    const newUser: User = new User(login, email, passwordHash);
    await usersRepository.create(newUser);

    try {
      await emailAdapter.sendEmail(
        newUser.email,
        newUser.emailConfirmation!.confirmationCode!,
        emailExamples.registrationEmail,
      );

      return handleSuccessResult(newUser);
    } catch (err: unknown) {
      console.error(err);
    }
  }
  async confirmEmail(code: string): Promise<RegistrationResult<null>> {
    const user: UserDB | null =
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
    if (user.emailConfirmation!.expirationDate! < new Date()) {
      return handleBadRequestResult("code is expired", "confirmation code");
    }
    if (user.emailConfirmation.isConfirmed) {
      return handleBadRequestResult("code has already been applied", "code");
    }

    await usersRepository.update(user.id!);
    return handleSuccessResult();
  }
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

    const newConfirmationCode = randomUUID();
    try {
      await emailAdapter.sendEmail(
        user.email,
        newConfirmationCode,
        emailExamples.registrationEmail,
      );

      return handleSuccessResult();
    } catch (err: unknown) {
      console.error(err);
      return;
    }
  }
  async loginUser(
    sessionDto: SessionDto,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(
      sessionDto.loginOrEmail,
      sessionDto.password,
    );
    if (result.status !== ResultStatus.Success) {
      //результат проверки credentials
      const loginOrEmailError: AuthError =
        result.extensions!.errorsMessages.find(
          (error) => error.field === "loginOrEmail", //ищем ошибку по полю loginOrEmail
        );
      const passwordError: AuthError = result.extensions!.errorsMessages.find(
        (error) => error.field === "password", //ищем ошибку по полю password
      );

      if (loginOrEmailError) {
        return handleUnauthorizedFResult("wrong credentials", "loginOrEmail");
      }
      if (passwordError) {
        return handleUnauthorizedFResult("wrong credentials", "password");
      }
    }
    const accessToken = await jwtService.createAccessToken(result.data!.id!);
    const deviceId = randomUUID(); //формируем deviceId
    const refreshToken = await jwtService.createRefreshToken(
      result.data!.id!, //используем id user и кладем в payload refreshToken
      deviceId,
    );

    const payloadOfRefreshToken = await jwtService.verifyToken(refreshToken);
    const sessionData: SessionDataType = {
      userId: result.data!.id!,
      deviceId: deviceId,
      iat: new Date(payloadOfRefreshToken!.iat * 1000).toISOString(), //приводим к читаемой дате,
      deviceName: sessionDto.deviceName,
      ip: sessionDto.ip,
    };
    await sessionsRepository.createSession(sessionData); //передаем в DAL данные о сессии и сохраняем их в бд
    return handleSuccessResult({ accessToken, refreshToken }); //
  }
  async logout(deviceId: string): Promise<Result<null>> {
    await sessionsRepository.deleteSessionByDeviceId(deviceId);
    return handleSuccessResult();
  }
  async refreshSessions(
    userId: string | undefined,
    deviceId: string | undefined,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    if (!userId || !deviceId) {
      return handleUnauthorizedFResult("access denied", "deviceId or userId");
    }
    const accessToken = await jwtService.createAccessToken(userId); //создаем пару новых токенов
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    const newRefreshTokenPayload = await jwtService.verifyToken(refreshToken);
    const newIat = new Date(newRefreshTokenPayload!.iat * 1000).toISOString(); //приводим дату к человеко читаемому формату
    await sessionsRepository.updateSessions(
      newIat, //обновляем сессию, передаем новый iat
      newRefreshTokenPayload!.deviceId,
    );
    return handleSuccessResult({ accessToken, refreshToken });
  }
  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserOutput | null>> {
    const user = await usersRepository.isUserExistByEmailOrLogin(loginOrEmail);
    if (!user) {
      return handleNotFoundResult("not found", "loginOrEmail");
    }
    const isPasscorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash!,
    );
    if (!isPasscorrect) {
      return handleBadRequestResult("password", "wrong password");
    }
    return handleSuccessResult(user);
  }
}
export const authService = new AuthService();
