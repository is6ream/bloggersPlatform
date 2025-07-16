import { WithId } from "mongodb";
import { UserDBType } from "../../users/input/create-user-dto";
import { usersRepository } from "../../users/repositories/users.repository";
import { ResultStatus } from "../../core/result/resultCode";
import { Result } from "../../core/result/result.type";
import { bcryptService } from "../adapters/bcrypt.service";

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string
  ): Promise<Result<UserDBType | null>> {
    const result = await this.checkUserCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success)
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: "Unauthorized",
        extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
        data: null,
      };

    return {
      status: ResultStatus.Success,
      extensions: [],
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<Result<WithId<UserDBType> | null>> {
    const user = await usersRepository.isUserExistByEmail(loginOrEmail);
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
      user.passwordHash
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
