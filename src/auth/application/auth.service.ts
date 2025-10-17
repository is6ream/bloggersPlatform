import { jwtService } from "../adapters/jwt.service";
import {
  PassRecoveryDtoType,
  UsersRepository,
} from "../../users/infrastructure/users.repository";
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
import { SessionsRepository } from "../../securityDevices/infrastructure/sessionsRepository";
import { UserOutput } from "../../users/types/user.output";
import { UserDB } from "../../users/input/create-user-dto";
import { AuthError } from "../types/authErrorType";
import { injectable, inject } from "inversify";
import { RecoveryCodeTypeDB } from "../types/recoveryCodeType";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(SessionsRepository) private sessionsRepository: SessionsRepository,
  ) {}

  async registerUser(
    login: string,
    password: string,
    email: string,
  ): Promise<RegistrationResult<User | null> | undefined> {
    const user = await this.usersRepository.doesExistByLoginOrEmail(
      login,
      email,
    ); //проверяем, существует ли пользователь уже в системе
    if (user?.login === login) {
      //если логин юзера равен логину, который поступил, 404
      return handleBadRequestResult("user already registered", "login");
    } else if (user?.email === email) {
      return handleBadRequestResult("user already registered", "email");
    }
    const passwordHash = await bcryptService.generateHash(password);

    const newUser: User = new User(login, email, passwordHash); //сначала создаем пользователя, потом, отправляем его же код подтверждения в path
    await this.usersRepository.create(newUser);

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
      await this.usersRepository.findUserByConfirmationCode(code);
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

    await this.usersRepository.update(user.id!);
    return handleSuccessResult();
  }

  async resendingEmail(
    email: string,
  ): Promise<RegistrationResult<null> | undefined> {
    const user = await this.usersRepository.isUserExistByEmailOrLogin(email);
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
        console.log("loginOrEmailError", loginOrEmailError);
        return handleUnauthorizedFResult("wrong credentials", "loginOrEmail");
      }
      if (passwordError) {
        console.log("passwordError", passwordError);
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
    await this.sessionsRepository.createSession(sessionData); //передаем в DAL данные о сессии и сохраняем их в бд
    return handleSuccessResult({ accessToken, refreshToken }); //
  }

  async logout(deviceId: string): Promise<Result<null>> {
    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
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
    await this.sessionsRepository.updateSessions(
      newIat, //обновляем сессию, передаем новый iat
      newRefreshTokenPayload!.deviceId,
    );
    return handleSuccessResult({ accessToken, refreshToken });
  }

  async requestPasswordReset(email: string): Promise<Result<void> | null> {
    const user: User | null = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    console.log(user);
    user.createRecoveryObject();
    console.log(user.passwordRecovery)
    const recoveryCode = user.passwordRecovery.recoveryCode; //здесь падает ошибка undefined
    const expirationDate = user.passwordRecovery.passRecoveryExpDate;
    const recoveryDto: PassRecoveryDtoType = {
      recoveryCode: recoveryCode!,
      expirationDate: expirationDate!,
    };
    await this.usersRepository.updatePasswordRecovery(user.email, recoveryDto);
    try {
      await emailAdapter.sendEmail(
        email,
        user.passwordRecovery.recoveryCode!,
        emailExamples.passwordRecoveryEmail,
      );
      return handleSuccessResult();
    } catch (err: unknown) {
      console.error(err);
      return handleSuccessResult();
    }
  }
  async resetPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<Result> {
    const code: RecoveryCodeTypeDB | null =
      await this.usersRepository.findConfirmationCode(recoveryCode);
    if (!code) {
      return handleBadRequestResult(
        "message code is incorrect",
        "recoveryCode",
      );
    }
    if (code.expirationDate < new Date(Date.now())) {
      return handleBadRequestResult("code is expired", "recoveryCode");
    }

    const user = await this.usersRepository;
  }

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserOutput | null>> {
    const user =
      await this.usersRepository.isUserExistByEmailOrLogin(loginOrEmail);
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
