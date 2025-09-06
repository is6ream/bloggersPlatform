import { jwtService } from "./../adapters/jwt.service";
import { WithId } from "mongodb";
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

export const authService = {
  async registerUser(
    login: string,
    password: string,
    email: string,
  ): Promise<RegistrationResult<User | null> | undefined> {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user?.login === login) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad request",
        extensions: {
          errorsMessages: [
            { message: "user already registered", field: "login" },
          ],
        },
        data: null,
      };
    } else if (user?.email === email) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad request",
        extensions: {
          errorsMessages: [
            { message: "user already registered", field: "email" },
          ],
        },
        data: null,
      };
    }
    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User(login, email, passwordHash);
    await usersRepository.create(newUser);

    try {
      emailAdapter.sendEmail(
        newUser.email,
        newUser.emailConfirmation!.confirmationCode,
        emailExamples.registrationEmail,
      );

      return {
        status: ResultStatus.Success,
        data: newUser,
      };
    } catch (err: unknown) {
      console.error(err);
    }
  },

  async confirmEmail(code: string): Promise<RegistrationResult<null>> {
    const user: UserDbDto | null =
      await usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [
            {
              message: "Confirmation code is incorrect",
              field: "confirmation code",
            },
          ],
        },
      };
    }
    if (user?.emailConfirmation.confirmationCode !== code) {
      console.log("no confirmation code match");
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [
            {
              message: "Confirmation code is incorrect",
              field: "confirmation code",
            },
          ],
        },
      };
    }
    if (user.emailConfirmation?.expirationDate < new Date()) {
      console.log("code is expired");
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [
            { message: "Code is expired", field: "confirmation code" },
          ],
        },
      };
    }
    if (user.emailConfirmation.isConfirmed === true) {
      console.log("code has already been applied  ");
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [
            {
              message: "Code has already been applied",
              field: "code",
            },
          ],
        },
      };
    }

    await usersRepository.update(user.id);
    return {
      status: ResultStatus.Success,
      data: null,
    };
  },
  async resendingEmail(
    email: string,
  ): Promise<RegistrationResult<null> | undefined> {
    const user = await usersRepository.isUserExistByEmailOrLogin(email);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [{ message: "user does not exist", field: "email" }],
        },
        data: null,
      };
    }
    if (user.emailConfirmation?.isConfirmed === true) {
      return {
        status: ResultStatus.BadRequest,
        extensions: {
          errorsMessages: [
            { message: "email is already confirmed", field: "email" },
          ],
        },
        data: null,
      };
    }

    const newConfimationCode = randomUUID();
    try {
      await emailAdapter.sendEmail(
        user.email,
        newConfimationCode,
        emailExamples.registrationEmail,
      );

      return {
        status: ResultStatus.Success,
        data: null,
      };
    } catch (err: unknown) {
      console.error(err);
      return;
    }
  },

  async updateTokens(
    userId: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const accessToken = await jwtService.createAcessToken(userId);
    const refreshToken = await jwtService.createRefreshToken(userId);
    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ message: "Wrong credentials", field: "loginOrEmail" }],
        data: null,
      };
    const accessToken = await jwtService.createAcessToken(
      result.data!._id.toString(),
    );
    const refreshToken = await jwtService.createRefreshToken(
      result.data!._id.toString(),
    );
    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<WithId<UserDB> | null>> {
    const user = await usersRepository.isUserExistByEmailOrLogin(loginOrEmail);
    console.log(user, "check user in checkCredentials");
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: "Not found",
        extensions: [{ field: "loginOrEmail", message: "Not found" }],
      };
    }
    const isPasscorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPasscorrect)
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: "Bad request",
        extensions: [{ field: "password", message: "wrong password" }],
      };

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },
};
